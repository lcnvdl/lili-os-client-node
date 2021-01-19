const fs = require("fs");
const glob = require("glob");
const path = require("path");

class FsDriver {
  constructor(base) {
    this.base = base || process.cwd();
  }

  exists(pth) {
    const p = this._resolve(pth);
    return fs.existsSync(p);
  }

  list(pth) {
    const p = this._resolve(pth);
    return new Promise((resolve, reject) => {
      glob(p + "/*", (err, matches) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(matches.map(m => this._toIFile(m)));
        }
      });
    });
  }

  _toIFile(pth) {
    const stats = fs.statSync(pth);
    const normalized = path.normalize(pth).split("\\").join("/");

    const dto = {
      path: normalized,
      icon: null,
      size: stats.size,
      security: {
        authentication: false,
        readOnly: false,
      },
      properties: {
        isDirectory: !stats.isFile()
      },
    };
    
    return dto;
  }

  _resolve(pth) {
    pth = pth || "";

    if (!pth.startsWith("/")) {
      pth = path.join(this.base, pth);
    }

    return pth;
  }
}

module.exports = FsDriver;
