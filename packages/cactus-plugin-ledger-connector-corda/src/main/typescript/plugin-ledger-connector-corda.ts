import { promisify } from "util";
import { Server, createServer } from "http";
import { Server as SecureServer } from "https";

import { Optional } from "typescript-optional";
import { NodeSSH, Config as SshConfig } from "node-ssh";
import express, { Express } from "express";
import bodyParser from "body-parser";

import {
  IPluginLedgerConnector,
  IWebServiceEndpoint,
  IPluginWebService,
  PluginAspect,
  ICactusPluginOptions,
} from "@hyperledger/cactus-core-api";

import {
  Checks,
  Logger,
  LoggerProvider,
  LogLevelDesc,
  Servers,
} from "@hyperledger/cactus-common";

import { DeployContractJarsEndpoint } from "./web-services/deploy-contract-jars-endpoint";

export interface IPluginLedgerConnectorCordaOptions
  extends ICactusPluginOptions {
  logLevel?: LogLevelDesc;
  sshConfigAdminShell: SshConfig;
  sshConfigNodeShell: SshConfig;
  corDappsDir: string;
  webAppOptions?: any;
  cordaStartCmd?: string;
  cordaStopCmd?: string;
}

export class PluginLedgerConnectorCorda
  implements IPluginLedgerConnector<any, any, any, any>, IPluginWebService {
  public static readonly CLASS_NAME = "DeployContractJarsEndpoint";

  private readonly instanceId: string;
  private readonly log: Logger;

  public get className() {
    return DeployContractJarsEndpoint.CLASS_NAME;
  }

  private httpServer: Server | SecureServer | null = null;

  constructor(public readonly options: IPluginLedgerConnectorCordaOptions) {
    const fnTag = `${this.className}#constructor()`;

    Checks.truthy(options, `${fnTag} options`);
    Checks.truthy(options.sshConfigAdminShell, `${fnTag} sshConfigAdminShell`);
    Checks.truthy(options.sshConfigNodeShell, `${fnTag} sshConfigNodeShell`);
    Checks.truthy(options.instanceId, `${fnTag} instanceId`);

    const level = options.logLevel || "INFO";
    const label = "plugin-ledger-connector-corda";
    this.log = LoggerProvider.getOrCreate({ level, label });
    this.instanceId = this.options.instanceId;
  }

  public getAspect(): PluginAspect {
    return PluginAspect.LEDGER_CONNECTOR;
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public getPackageName(): string {
    return "@hyperledger/cactus-plugin-ledger-connector-corda";
  }

  public deployContract(options?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async transact(options?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async installWebServices(
    expressApp: any
  ): Promise<IWebServiceEndpoint[]> {
    this.log.info(`Installing web services for ${this.getPackageName()}...`);
    const webApp: Express = this.options.webAppOptions ? express() : expressApp;

    // FIXME refactor this
    // presence of webAppOptions implies that caller wants the plugin to configure it's own express instance on a custom
    // host/port to listen on
    if (this.options.webAppOptions) {
      this.log.info(`Creating dedicated HTTP server...`);
      const { port, hostname } = this.options.webAppOptions;

      webApp.use(bodyParser.json({ limit: "50mb" }));

      this.httpServer = createServer(webApp);
      const listenOptions = { port, hostname, server: this.httpServer };
      const addressInfo = await Servers.listen(listenOptions);

      this.log.info(`Creation of HTTP server OK %o`, { addressInfo });
    }

    const endpoints: IWebServiceEndpoint[] = [];
    {
      const endpoint = new DeployContractJarsEndpoint({
        sshConfigAdminShell: this.options.sshConfigAdminShell,
        sshConfigNodeShell: this.options.sshConfigNodeShell,
        logLevel: this.options.logLevel,
        corDappsDir: this.options.corDappsDir,
        cordaStartCmd: this.options.cordaStartCmd,
        cordaStopCmd: this.options.cordaStopCmd,
      });

      endpoint.registerExpress(webApp);

      endpoints.push(endpoint);

      this.log.info(`Registered endpoint at ${endpoint.getPath()}`);
    }
    return endpoints;
  }

  public getHttpServer(): Optional<Server | SecureServer> {
    return Optional.ofNullable(this.httpServer);
  }

  public async shutdown(): Promise<void> {
    const serverMaybe = this.getHttpServer();
    if (serverMaybe.isPresent()) {
      const server = serverMaybe.get();
      await promisify(server.close.bind(server))();
    }
  }

  public async getFlowList(): Promise<any> {
    const command = "flow list";
    return this.executeCordaCommand(command);
  }

  public async startFlow(flow: string, state: object): Promise<any> {
    const command =
      "flow start " +
      flow +
      " " +
      JSON.stringify(state)
        .replace("{", "")
        .replace("}", "")
        .replace(/\"/gi, " ");
    return this.executeCordaCommand(command);
  }

  public async queryVault(stateName: string): Promise<any> {
    const command = "run vaultQuery contractStateType: " + stateName;
    return this.executeCordaCommand(command);
  }

  public async executeCordaCommand(command: string): Promise<any> {
    const ssh = new NodeSSH();
    let nodeResult = "";

    await ssh.connect(this.options.sshConfigNodeShell);
    const result = await ssh.execCommand(command);
    ssh.dispose();
    this.log.debug("STDOUT: " + result.stdout);
    this.log.debug("STDERR: " + result.stderr);
    nodeResult = result.stdout;
    return nodeResult;
  }
}
