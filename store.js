module.exports = {
    createStory ({ title, content }) {
        console.log(`Add user ${title} with password ${content}`)
        return Promise.resolve()
    }
}