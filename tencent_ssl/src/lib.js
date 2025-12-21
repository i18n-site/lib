import { teo as TEO } from "tencentcloud-sdk-nodejs-teo";
import { ssl as SSL } from "tencentcloud-sdk-nodejs-ssl";
import Cert from "@3-/cert";

const Teo = TEO.v20220901.Client,
  Ssl = SSL.v20191205.Client;

const uploadCert = async (ssl, alias, key, crt) => {
    const res = await ssl.UploadCertificate({
      CertificatePublicKey: crt,
      CertificatePrivateKey: key,
      Alias: alias,
    });
    return res.CertificateId;
  },
  bindCertToZone = async (teo, zone_id, host, cert_id) => {
    const hosts_res = await teo.DescribeHostsSetting({
      ZoneId: zone_id,
    });

    const hosts = hosts_res.DetailHosts?.map((h) => h.Host) || [host];

    await teo.ModifyHostsCertificate({
      ZoneId: zone_id,
      Hosts: hosts.filter((i) => {
        // 边缘函数会有诡异的域名
        return i == host || i.endsWith(`.${host}`);
      }),
      Mode: "sslcert",
      ServerCertInfo: [
        {
          CertId: cert_id,
        },
      ],
    });
  };

export default ([secretId, secretKey]) => {
  const conf = {
      credential: {
        secretId,
        secretKey,
      },
    },
    teo = new Teo(conf),
    ssl = new Ssl(conf);

  return async ([key, crt]) => {
    const { host, expire } = Cert(crt),
      zones = (
        await teo.DescribeZones({
          Filters: [
            {
              Name: "zone-name",
              Values: [host],
            },
          ],
        })
      ).Zones.filter((z) => {
        const is_active = z.ActiveStatus === "active";
        if (!is_active) {
          console.log("腾讯云", z.ZoneName, z.ActiveStatus);
        }
        return is_active;
      });

    if (zones.length > 0) {
      const cert_id = await uploadCert(ssl, host + "-" + expire, key, crt);
      for (const zone of zones) {
        await bindCertToZone(teo, zone.ZoneId, host, cert_id);
      }
    }
  };
};
