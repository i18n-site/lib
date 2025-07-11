import { EmailMessage } from 'cloudflare:email'

export default (sender, from_name, from, to, subject, txt) =>
  sender.send(
    new EmailMessage(
      from
      to
      [
        'MIME-Version: 1.0'
        'Message-ID: '+ Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url')
        "From: #{JSON.stringify(from_name)}<#{from}>"
        "To: #{to}"
        "Subject: #{subject}"
        'Content-Type: text/plain; charset=UTF-8'
        ''
        txt
      ].join('\r\n')
    )
  )
