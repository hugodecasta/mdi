import fs from 'fs'
import rimraf from 'rimraf'
import fse from 'fs-extra'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const from_dir = __dirname
const art_dir = __dirname + '/art'
if (fs.existsSync(art_dir)) rimraf.sync(art_dir)

fs.mkdirSync(art_dir)

const excluder = ['.github', '.git']
const files = fs.readdirSync(from_dir).filter(f => f.includes('.')).filter(f => !excluder.includes(f))
files.forEach(f => fs.copyFileSync(from_dir + '/' + f, art_dir + '/' + f))

const dirs = ['dist', 'waiting']
dirs.forEach(d => fse.copySync(from_dir + '/' + d, art_dir + '/' + d))