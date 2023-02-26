import { DnsObject } from "./dns"
import { RoutingObject } from "./router"
import { InboundObject } from "./inbound"
import { OutboundObject } from "./outbound"
import { ServiceObject } from "./service"
/**
  在 V5 版本中，引入了新的配置格式。此配置格式旨在替换过去版本的配置格式。目前此格式仍处于草案阶段，可能会被随时更改。
:::tip
执行 `./v2ray run -c $configure_file_name -format jsonv5` 命令以运行您的配置文件。
:::
```json
{
    "log": {},
    "dns": {},
    "router": {},
    "inbounds": [],
    "outbounds": [],
    "services": {}
}
```
 **/
export interface V2FlyConfig {
/**
日志设置，设置 V2Ray 日志记录的
若未设置此项，则使用默认值。
**/
log: LogObject
/**
内置的 DNS 客户端，用于设置 DNS 解析。
若未设置此项，则默认使用本机的 DNS 设置。
**/
dns: DnsObject
/**
路由功能。
若未设置此项，则所有流量都会被转发到第一个出站。
**/
router: RoutingObject
/**
入站设置。
**/
inbounds: InboundObject[]
/**
出站设置。
**/
outbounds: OutboundObject[]
/**
辅助服务，配置附加组件的功能。
使用软件的基本功能不需要配置此项，但是可以通过配置此项以使用高级功能。
**/
services: ServiceObject[]
}
/**
  `LogObject` 是配置文件中 `log` 字段所使用的 JSON 字段。
```json
{
    "access":{},
    "error":{}
}
```
 **/
export interface LogObject {
/**
访问日志设置。
**/
access: LogSpecObject
/**
错误日志设置。
**/
error: LogSpecObject
}
/**
  
 **/
export interface LogSpecObject {
/**
* `"None"`：日志将被丢弃。
* `"Console"`：日志将被输出到标准输出。
* `"File"`：日志将被输出到一个文件。
**/
type: "None" | "Console" | "File"
/**
日志的文件路径，其值是一个合法的文件路径， 例如 `"/tmp/v2ray/_error.log"` (Linux) 或 `"C:\\Temp\\v2ray\\_error.log"` (Windows)。
**/
path: string
/**
日志等级，默认值为 `"Warning"`。
* `"Debug"`：详细的调试性信息。同时包含所有 `"Info"` 内容
* `"Info"`：V2Ray 在运行时的状态，不影响正常使用。同时包含所有 `"Warning"` 内容。
* `"Warning"`：V2Ray 可能遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 `"Error"` 内容。
* `"Error"`：V2Ray 遇到了无法正常运行的问题，需要立即解决。
* `"None"`：不记录任何内容。
**/
level: "Debug" | "Info" | "Warning" | "Error" | "None"
}