> base-x

export URLE = BaseX '!$-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'

export default URLE.encode.bind URLE
export urld = URLE.decode.bind URLE
