exports.up = function (knex) {
    return knex.schema.createTable('story', function (t) {
        t.increments('id').primary()
        t.string('title').notNullable()
        t.string('content').notNullable()
        t.string('author').notNullable()
        t.string('sound').notNullable()
        t.string('light').notNullable()

    })
}
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user')
}
