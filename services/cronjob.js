const {CronJob} = require('cron');
const {Op} = require('sequelize');
const ArchievedChat = require('../models/archievedChats');
const Messages = require('../models/messeges');
const sequelize = require('../util/database');

const job = new CronJob(
    '0 0 * * *',
    archeiveChats,
    null,
    false,
    'Asia/Kolkata'
)

async function archeiveChats(){
    
    try {
          const transaction = await sequelize.transaction();

        const date = new Date();
        date.setDate(new Date().getDate() - 1);

        const archievedChats = await Messages.findAll({
            attributes: ['id', 'message', 'filetype', 'userId', 'groupId'],
            where: {
                updatedAt: {
                    [Op.lt]: date
                }
            }
        });

        try {
            for (const chat of archievedChats) {
                await ArchievedChat.create({
                    id: chat.id,
                    message: chat.message,
                    isImage: chat.filetype,
                    userId: chat.userId,
                    groupId: chat.groupId
                }, {
                    transaction: transaction
                });

                await Messages.destroy({
                    where: { id: chat.id },
                    transaction: transaction
                });
            }

            await transaction.commit();
            console.log('Chats archived and deleted successfully.');

        } 
        catch(err){
            throw new Error('Error in archiving and deleting old chats');
        }
    } 
    catch(err){
        console.log('Error starting transaction:', err.message);
        await transaction.rollback();
    }
}



module.exports = {
    job
};

