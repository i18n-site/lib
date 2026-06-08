< (key_file_name, cert_file_name)=>
  (uws)=>
    uws.SSLApp({
      key_file_name
      cert_file_name
    })
