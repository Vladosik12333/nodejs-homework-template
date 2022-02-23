const fs = require("fs/promises");
const { join } = require("path");

class DB {
  constructor() {
    this.file = join(__dirname, "contacts.json");
  }

  async readFile() {
    const file = await fs.readFile(this.file, "utf-8");
    return JSON.parse(file);
  }

  async writeFile(data) {
    await fs.writeFile(this.file, JSON.stringify(data, null, 2));
  }
}

module.exports = DB;
