import fs from 'fs/promises'
import crypto from 'crypto'

class EncryptedFileAdapter {
  constructor (file) {
    this.file = file
    this.ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32)) // Use env variable for key
    this.IV_LENGTH = 16 // AES-256-CBC uses a 16-byte IV
  }

  async encrypt (data) {
    const iv = crypto.randomBytes(this.IV_LENGTH)
    const cipher = crypto.createCipheriv('aes-256-cbc', this.ENCRYPTION_KEY, iv)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return `${iv.toString('hex')}:${encrypted}`
  }

  async decrypt (encryptedData) {
    const [iv, encryptedText] = encryptedData.split(':')
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.ENCRYPTION_KEY,
      Buffer.from(iv, 'hex')
    )
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  async read () {
    try {
      const data = await fs.readFile(this.file, 'utf8')
      return JSON.parse(await this.decrypt(data))
    } catch (error) {
      // If the file doesn't exist or can't be read, return null
      return null
    }
  }

  async write (data) {
    const encryptedData = await this.encrypt(JSON.stringify(data))
    await fs.writeFile(this.file, encryptedData, 'utf8')
  }
}

export default EncryptedFileAdapter
