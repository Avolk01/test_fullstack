const db = require('./database.js');

const saveToDatabase = async (req, res, next) => {
    const {tasks} = req.body;
    if(tasks){
        await db.query(`DELETE FROM test.tasks`);
        tasks.forEach(async element => {
            await db.query(`INSERT INTO test.tasks
                                        (task_name, is_complete)
                                        VALUES ($1, $2) 
                                        RETURNING *                               
                                        `, [element.task_name, element.is_complete]);
        });        
        const resTasks = await db.query(`  SELECT * FROM test.tasks`);
        res.send(resTasks.rows);
    }
};

const createTask = async (req, res) => {
    const { task_name, is_complete } = req.body;
    const task = await db.query(`  INSERT INTO test.tasks
                                    (task_name, is_complete)
                                    VALUES ($1, $2) 
                                    RETURNING *                               
                                    `, [task_name, is_complete]);
    res.send(task.rows[0]);
}

const getAllTask = async (req, res) => {
    const tasks = await db.query(`  SELECT * FROM test.tasks`);
    res.send(tasks.rows);
}

const updateTask = async (req, res) => {
    const id = req.params.id
    const { taskName } = req.body;
    const task = await db.query(`  UPDATE test.tasks 
                                    SET name = $1 
                                    WHERE id = $2
                                    RETURNING *                            
                                    `, [taskName, id]);
    res.send(task.rows[0]);
}

const deleteTask = async (req, res) => {
    const {id} = req.params.id;
    const task = await db.query(`  DELETE FROM test.tasks WHERE id = $1
                                    RETURNING *`, [id]);
    res.send(task.rows[0]);
}

module.exports = {
    saveToDatabase,
    createTask,
    getAllTask,
    updateTask,
    deleteTask
}
