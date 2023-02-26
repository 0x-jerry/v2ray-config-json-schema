import { TcpObject } from "./transport/tcp"
import { KcpObject } from "./transport/mkcp"
import { WebSocketObject } from "./transport/websocket"
import { HttpObject } from "./transport/h2"
import { QuicObject } from "./transport/quic"
import { DomainSocketObject } from "./transport/domainsocket"
import { grpcObject } from "./transport/grpc"
/**
  底层传输方式（transport）是当前 V2Ray 节点和其它节点对接的方式。底层传输方式提供了稳定的数据传输通道。通常来说，一个网络连接的两端需要有对称的传输方式。比如一端用了 WebSocket，那么另一个端也必须使用 WebSocket，否则无法建立连接。
底层传输（transport）配置分为两部分，一是全局设置（[TransportObject](#transportobject)），二是分协议配置（[StreamSettingsObject](#streamsettingsobject)）。分协议配置可以指定每个单独的入站出站协议用怎样的方式传输。通常来说客户端和服务器对应的出站入站协议需要使用同样的传输方式。当分协议传输配置指定了一种传输方式，但没有填写其设置时，此传输方式会使用全局配置中的设置。
 **/
export interface Transport {
  [key: string]: any

}
/**
  `TransportObject` 对应配置文件的 `transport` 项。
```json
{
    "tcpSettings": {},
    "kcpSettings": {},
    "wsSettings": {},
    "httpSettings": {},
    "quicSettings": {},
    "dsSettings": {},
    "grpcSettings": {}
}
```
 **/
export interface TransportObject {
  [key: string]: any
/**
针对 TCP 连接的配置。
**/
tcpSettings?: TcpObject
/**
针对 mKCP 连接的配置。
**/
kcpSettings?: KcpObject
/**
针对 WebSocket 连接的配置。
**/
wsSettings?: WebSocketObject
/**
针对 HTTP/2 连接的配置。
**/
httpSettings?: HttpObject
/**
针对 QUIC 连接的配置。
**/
quicSettings?: QuicObject
/**
针对 Domain Socket 连接的配置。
**/
dsSettings?: DomainSocketObject
/**
针对 gRPC 连接的配置。 (v4.36.0+)
**/
grpcSettings?: grpcObject
}
/**
  `StreamSettingsObject` 对应出站入站协议中的 `streamSettings` 项。每一个入站、出站连接都可以分别配置不同的传输配置，都可以设置 `streamSettings` 来进行一些传输的配置。
```json
{
    "network": "tcp",
    "security": "none",
    "tlsSettings": {},
    "tcpSettings": {},
    "kcpSettings": {},
    "wsSettings": {},
    "httpSettings": {},
    "quicSettings": {},
    "dsSettings": {},
    "grpcSettings": {},
    "sockopt": {
        "mark": 0,
        "tcpFastOpen": false,
        "tcpFastOpenQueueLength": 4096,
        "tproxy": "off",
        "tcpKeepAliveInterval": 0
    }
}
```
 **/
export interface StreamSettingsObject {
  [key: string]: any
/**
数据流所使用的网络类型，默认值为 `"tcp"`
**/
network?: "tcp" | "kcp" | "ws" | "http" | "domainsocket" | "quic" | "grpc"
/**
是否启用传输层加密，支持的选项有 `"none"` 表示不加密（默认值），`"tls"` 表示使用 [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)。
**/
security?: "none" | "tls"
/**
TLS 配置。TLS 由 Golang 提供，支持 TLS 1.3，不支持 DTLS。
**/
tlsSettings?: TLSObject
/**
当前连接的 TCP 配置，仅当此连接使用 TCP 时有效。配置内容与上面的全局配置相同。
**/
tcpSettings?: TcpObject
/**
当前连接的 mKCP 配置，仅当此连接使用 mKCP 时有效。配置内容与上面的全局配置相同。
**/
kcpSettings?: KcpObject
/**
当前连接的 WebSocket 配置，仅当此连接使用 WebSocket 时有效。配置内容与上面的全局配置相同。
**/
wsSettings?: WebSocketObject
/**
当前连接的 HTTP/2 配置，仅当此连接使用 HTTP/2 时有效。配置内容与上面的全局配置相同。
**/
httpSettings?: HttpObject
/**
当前连接的 QUIC 配置，仅当此连接使用 QUIC 时有效。配置内容与上面的全局配置相同。
**/
quicSettings?: QuicObject
/**
当前连接的 Domain socket 配置，仅当此连接使用 Domain socket 时有效。配置内容与上面的全局配置相同。
**/
dsSettings?: DomainSocketObject
/**
当前连接的 gRPC 配置，仅当此连接使用 gRPC 时有效。配置内容与上面的全局配置相同。
**/
grpcSettings?: grpcObject
/**
用作透明代理的配置。
**/
sockopt?: SockoptObject
}
/**
  ```json
{
    "serverName": "v2ray.com",
    "alpn": [
        "h2",
        "http/1.1"
    ],
    "allowInsecure": false,
    "disableSystemRoot": false,
    "certificates": [],
    "verifyClientCertificate": false,
    "pinnedPeerCertificateChainSha256": ""
}
```
 **/
export interface TLSObject {
  [key: string]: any
/**
指定服务器端证书的域名，在连接由 IP 建立时有用。当目标连接由域名指定时，比如在 Socks 入站时接收到了域名，或者由 Sniffing 功能探测出了域名，这个域名会自动用于 `serverName`，无须手动配置。
**/
serverName?: string
/**
一个字符串数组，指定了 TLS 握手时指定的 ALPN 数值。默认值为 `["h2", "http/1.1"]`。
**/
alpn?: Array<string>
/**
是否允许不安全连接（仅用于客户端）。默认值为 `false`。当值为 `true` 时，V2Ray 不会检查远端主机所提供的 TLS 证书的有效性。
**/
allowInsecure?: true | false
/**
（V2Ray 4.18+）是否禁用操作系统自带的 CA 证书。默认值为 `false`。当值为 `true` 时，V2Ray 只会使用 `certificates` 中指定的证书进行 TLS 握手。当值为 `false` 时，V2Ray 只会使用操作系统自带的 CA 证书进行 TLS 握手。
**/
disableSystemRoot?: true | false
/**
证书列表，其中每一项表示一个证书（建议 fullchain）。
**/
certificates?: Array<CertificateObject>
/**
使用标准编码格式表示的远程服务器的证书链的SHA256散列值。在设置后，远程服务器的证书链的散列值必须为列表中的数值之一。(v4.38.0+)
<!--
此数值可以使用V2Ray自带的 v2ctl 工具的 certChainHash 工具根据服务器的证书链文件进行计算(按照管理，这个文件的名字一般叫 fullchain.pem )。如果没有中间证书（如自签发证书），证书链的散列值和证书本身的散列值相同。-->
在连接因为此策略失败时，会展示此证书链散列。不建议使用这种方式获得证书链散列值，因为在这种情况下您没有机会验证此时服务器提供的证书是否为真实证书。
**/
pinnedPeerCertificateChainSha256?: Array<string>
/**
在连接时进行客户端证书认证。在打开此选项后，客户端将需要配置客户端证书才能连接到服务器端。(4.42.0+)
客户端证书必须由程序内配置的客户端证书颁发机构签发。系统内置证书颁发机构以及用于认证服务器端的证书颁发机构不会自动被信任。
**/
verifyClientCertificate?: true | false
}
/**
  ```json
{
    "usage": "encipherment",
    "certificateFile": "/path/to/certificate.crt",
    "keyFile": "/path/to/key.key",
    "certificate": [
        "-----BEGIN CERTIFICATE-----",
        "MIICwDCCAaigAwIBAgIRAO16JMdESAuHidFYJAR/7kAwDQYJKoZIhvcNAQELBQAw",
        "ADAeFw0xODA0MTAxMzU1MTdaFw0xODA0MTAxNTU1MTdaMAAwggEiMA0GCSqGSIb3",
        "DQEBAQUAA4IBDwAwggEKAoIBAQCs2PX0fFSCjOemmdm9UbOvcLctF94Ox4BpSfJ+",
        "3lJHwZbvnOFuo56WhQJWrclKoImp/c9veL1J4Bbtam3sW3APkZVEK9UxRQ57HQuw",
        "OzhV0FD20/0YELou85TwnkTw5l9GVCXT02NG+pGlYsFrxesUHpojdl8tIcn113M5",
        "pypgDPVmPeeORRf7nseMC6GhvXYM4txJPyenohwegl8DZ6OE5FkSVR5wFQtAhbON",
        "OAkIVVmw002K2J6pitPuJGOka9PxcCVWhko/W+JCGapcC7O74palwBUuXE1iH+Jp",
        "noPjGp4qE2ognW3WH/sgQ+rvo20eXb9Um1steaYY8xlxgBsXAgMBAAGjNTAzMA4G",
        "A1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDATAMBgNVHRMBAf8EAjAA",
        "MA0GCSqGSIb3DQEBCwUAA4IBAQBUd9sGKYemzwPnxtw/vzkV8Q32NILEMlPVqeJU",
        "7UxVgIODBV6A1b3tOUoktuhmgSSaQxjhYbFAVTD+LUglMUCxNbj56luBRlLLQWo+",
        "9BUhC/ow393tLmqKcB59qNcwbZER6XT5POYwcaKM75QVqhCJVHJNb1zSEE7Co7iO",
        "6wIan3lFyjBfYlBEz5vyRWQNIwKfdh5cK1yAu13xGENwmtlSTHiwbjBLXfk+0A/8",
        "r/2s+sCYUkGZHhj8xY7bJ1zg0FRalP5LrqY+r6BckT1QPDIQKYy615j1LpOtwZe/",
        "d4q7MD/dkzRDsch7t2cIjM/PYeMuzh87admSyL6hdtK0Nm/Q",
        "-----END CERTIFICATE-----"
    ],
    "key": [
        "-----BEGIN RSA PRIVATE KEY-----",
        "MIIEowIBAAKCAQEArNj19HxUgoznppnZvVGzr3C3LRfeDseAaUnyft5SR8GW75zh",
        "bqOeloUCVq3JSqCJqf3Pb3i9SeAW7Wpt7FtwD5GVRCvVMUUOex0LsDs4VdBQ9tP9",
        "GBC6LvOU8J5E8OZfRlQl09NjRvqRpWLBa8XrFB6aI3ZfLSHJ9ddzOacqYAz1Zj3n",
        "jkUX+57HjAuhob12DOLcST8np6IcHoJfA2ejhORZElUecBULQIWzjTgJCFVZsNNN",
        "itieqYrT7iRjpGvT8XAlVoZKP1viQhmqXAuzu+KWpcAVLlxNYh/iaZ6D4xqeKhNq",
        "IJ1t1h/7IEPq76NtHl2/VJtbLXmmGPMZcYAbFwIDAQABAoIBAFCgG4phfGIxK9Uw",
        "qrp+o9xQLYGhQnmOYb27OpwnRCYojSlT+mvLcqwvevnHsr9WxyA+PkZ3AYS2PLue",
        "C4xW0pzQgdn8wENtPOX8lHkuBocw1rNsCwDwvIguIuliSjI8o3CAy+xVDFgNhWap",
        "/CMzfQYziB7GlnrM6hH838iiy0dlv4I/HKk+3/YlSYQEvnFokTf7HxbDDmznkJTM",
        "aPKZ5qbnV+4AcQfcLYJ8QE0ViJ8dVZ7RLwIf7+SG0b0bqloti4+oQXqGtiESUwEW",
        "/Wzi7oyCbFJoPsFWp1P5+wD7jAGpAd9lPIwPahdr1wl6VwIx9W0XYjoZn71AEaw4",
        "bK4xUXECgYEA3g2o9WqyrhYSax3pGEdvV2qN0VQhw7Xe+jyy98CELOO2DNbB9QNJ",
        "8cSSU/PjkxQlgbOJc8DEprdMldN5xI/srlsbQWCj72wXxXnVnh991bI2clwt7oYi",
        "pcGZwzCrJyFL+QaZmYzLxkxYl1tCiiuqLm+EkjxCWKTX/kKEFb6rtnMCgYEAx0WR",
        "L8Uue3lXxhXRdBS5QRTBNklkSxtU+2yyXRpvFa7Qam+GghJs5RKfJ9lTvjfM/PxG",
        "3vhuBliWQOKQbm1ZGLbgGBM505EOP7DikUmH/kzKxIeRo4l64mioKdDwK/4CZtS7",
        "az0Lq3eS6bq11qL4mEdE6Gn/Y+sqB83GHZYju80CgYABFm4KbbBcW+1RKv9WSBtK",
        "gVIagV/89moWLa/uuLmtApyEqZSfn5mAHqdc0+f8c2/Pl9KHh50u99zfKv8AsHfH",
        "TtjuVAvZg10GcZdTQ/I41ruficYL0gpfZ3haVWWxNl+J47di4iapXPxeGWtVA+u8",
        "eH1cvgDRMFWCgE7nUFzE8wKBgGndUomfZtdgGrp4ouLZk6W4ogD2MpsYNSixkXyW",
        "64cIbV7uSvZVVZbJMtaXxb6bpIKOgBQ6xTEH5SMpenPAEgJoPVts816rhHdfwK5Q",
        "8zetklegckYAZtFbqmM0xjOI6bu5rqwFLWr1xo33jF0wDYPQ8RHMJkruB1FIB8V2",
        "GxvNAoGBAM4g2z8NTPMqX+8IBGkGgqmcYuRQxd3cs7LOSEjF9hPy1it2ZFe/yUKq",
        "ePa2E8osffK5LBkFzhyQb0WrGC9ijM9E6rv10gyuNjlwXdFJcdqVamxwPUBtxRJR",
        "cYTY2HRkJXDdtT0Bkc3josE6UUDvwMpO0CfAETQPto1tjNEDhQhT",
        "-----END RSA PRIVATE KEY-----"
    ]
}
```
 **/
export interface CertificateObject {
  [key: string]: any
/**
证书用途，默认值为 `"encipherment"`。
* `"encipherment"`：证书用于 TLS 认证和加密。
* `"verify"`：证书用于验证远端 TLS 的证书。当使用此项时，当前证书必须为 CA 证书。
* `"issue"`：证书用于签发其它证书。当使用此项时，当前证书必须为 CA 证书。
* `"verifyclient"`：用于验证客户端身份的证书颁发机构证书。当使用此项时，当前证书必须为 CA 证书。 (4.42.0+)
:::tip
在 Windows 平台上可以将自签名的 CA 证书安装到系统中，即可验证远端 TLS 的证书。
:::
:::tip
当有新的客户端请求时，假设所指定的 `serverName` 为 `"v2ray.com"`，V2Ray 会先从证书列表中寻找可用于 `"v2ray.com"` 的证书，如果没有找到，则使用任一 `usage` 为 `"issue"` 的证书签发一个适用于 `"v2ray.com"` 的证书，有效期为一小时。并将新的证书加入证书列表，以供后续使用。
:::
**/
usage?: "encipherment" | "verify" | "issue" | "verifyclient"
/**
证书文件路径，如使用 OpenSSL 生成，后缀名为 .crt。
:::tip
使用 `v2ctl cert -ca` 可以生成自签名的 CA 证书。
:::
**/
certificateFile?: string
/**
一个字符串数组，表示证书内容，格式如样例所示。`certificate` 和 `certificateFile` 二者选一。
**/
certificate?: Array<string>
/**
密钥文件路径，如使用 OpenSSL 生成，后缀名为 .key。目前暂不支持需要密码的 key 文件。
**/
keyFile?: string
/**
一个字符串数组，表示密钥内容，格式如样例如示。`key` 和 `keyFile` 二者选一。
当 `certificateFile` 和 `certificate` 同时指定时，V2Ray 优先使用 `certificateFile`。`keyFile` 和 `key` 也一样。
:::tip
当 `usage` 为 `"verify"` 时，`keyFile` 和 `key` 可均为空。
:::
**/
key?: Array<string>
}
/**
  ```json
{
    "mark": 0,
    "tcpFastOpen": false,
    "tcpFastOpenQueueLength": 4096,
    "tproxy": "off",
    "tcpKeepAliveInterval": 0
}
```
 **/
export interface SockoptObject {
  [key: string]: any
/**
一个整数。当其值非零时，在出站连接上标记 SO_MARK。
* 仅适用于 Linux 系统。
* 需要 CAP_NET_ADMIN 权限。
**/
mark?: number
/**
是否启用 [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80)。当其值为 `true` 时，强制开启 TFO；当其值为 `false` 时，强制关闭 TFO；当此项不存在时，使用系统默认设置。可用于入站出站连接。
* 仅在以下版本（或更新版本）的操作系统中可用:
  * Windows 10 (1604)
  * Mac OS 10.11 / iOS 9
  * Linux 3.16：系统已默认开启，无需配置。
  * FreeBSD 10.3
**/
tcpFastOpen?: true | false
/**
入站连接的 [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80) 队列长度，默认值为 `4096`，仅在 Linux 中可用 (v4.43.0+)。
**/
tcpFastOpenQueueLength?: number
/**
是否开启透明代理（仅适用于 Linux）。
* `"redirect"`：使用 Redirect 模式的透明代理。支持 TCP 和 UDP 连接。
* `"tproxy"`：使用 TProxy 模式的透明代理。支持 TCP 和 UDP 连接。
* `"off"`：关闭透明代理。
透明代理需要 Root 或 CAP\_NET\_ADMIN 权限。
:::tip
当 [Dokodemo-door](protocols/dokodemo.md) 中指定了 `followRedirect`，且 `sockopt.tproxy` 为空时，`sockopt.tproxy` 的值会被设为 `"redirect"`。
:::
**/
tproxy?: "redirect" | "tproxy" | "off"
/**
TCP 保持活跃的数据包的发送间隔，以秒为单位（仅适用于 Linux）。 (v4.39.0+)
0 代表保持默认值。
**/
tcpKeepAliveInterval?: number
}