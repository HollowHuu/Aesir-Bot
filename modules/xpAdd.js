const config = require('../config.json');

async function xpAdd({ db: db, id: id, xp: xp, client: client, }) {


    const channel = await client.channels.cache.get(config.level_channel_id);
    const user = await client.users.cache.get(id);

    // Check if user exists

    const userExists = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if(!userExists) {
        db.prepare('INSERT INTO users (id, xp, level) VALUES (?, ?, ?)').run(id, 0, 1);
        return;
    }

    db.prepare('UPDATE users SET xp = xp + ? WHERE id = ?').run(xp, id);
    
    const level = userExists.level;
    const newXP = userExists.xp + xp;
    const nextLevel = 15 * Math.pow(level, 2) + 100;
    if(newXP >= nextLevel) {
        db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXP - nextLevel, level + 1, id);
        console.log(user.nickname)
        if(user.nickname == null||user.nickname == undefined) {
            channel.send(`${user.displayName} has leveled up to level ${level + 1}!`);
        } else {
            channel.send(`${user.nickname} has leveled up to level ${level + 1}!`);
        }
    }
}

module.exports = {
    xpAdd
}