const errorHandler = {
    // Login and Registration Errors
    LOGIN_MISSING_FIELDS: {
        message: 'Missing email or password.',
        status: 400,
    },
    LOGIN_ACCOUNT_LOCKED: {
        message: 'Account is locked due to multiple failed login attempts. Please try again later.',
        status: 403,
    },
    LOGIN_INVALID_CREDENTIALS: {
        message: 'Invalid credentials',
        status: 401,
    },
    LOGIN_USER_NOT_FOUND: {
        message: 'User not found',
        status: 404,
    },
    LOGIN_SERVER_ERROR: {
        message: 'Internal login error.',
        status: 500,
    },
    REGISTER_MISSING_FIELDS: {
        message: 'Name, email and password are required.',
        status: 400,
    },
    REGISTER_INVALID_EMAIL: {
        message: 'Invalid email format.',
        status: 400,
    },
    REGISTER_INVALID_PASSWORD: {
        message: 'Password does not meet requirements.',
        status: 400,
    },
    REGISTER_DUPLICATE_EMAIL: {
        message: 'This email is already in use.',
        status: 409,
    },
    REGISTER_SERVER_ERROR: {
        message: 'Server error while registering user.',
        status: 500,
    },

    // User Management Errors
    USER_NOT_FOUND: {
        status: 404,
        message: 'Utilizador não encontrado.'
    },
    USER_GET_HABITS_FAILED: {
        status: 500,
        message: 'Erro ao obter hábitos do utilizador.'
    },
    USER_UNAUTHORIZED_ACTION: {
        status: 403,
        message: 'Utilizador não autorizado a realizar esta ação.'
    },
    GRANT_DAILY_XP_FAILED: {
        status: 500,
        message: 'Erro ao atribuir XP diário.',
    },
    USER_DELETE_FAILED: {
        status: 500,
        message: 'Erro ao eliminar utilizador.',
    },
    USER_LEVEL_FAILED: {
        status: 500,
        message: 'Erro ao obter nível do utilizador.'
    },

    //Habit Management Errors
    HABIT_CREATION_FAILED: {
        message: 'Erro ao criar hábito.',
        status: 500,
    },
    HABIT_MISSING_FIELDS: {
        message: 'Título e frequência são obrigatórios.',
        status: 400,
    },
    HABIT_INVALID_FREQUENCY: {
        message: 'Frequência inválida.',
        status: 400
    },
     HABIT_INVALID_CATEGORY: {
        status: 400,
        message: 'Categoria inválida.'
    },
    HABIT_TITLE_ALREADY_EXISTS: {
        message: 'Já existe um hábito com este título.',
        status: 409
    },
    GET_HABITS_FAILED: {
        status: 500,
        message: 'Erro ao buscar hábitos.'
    },
    HABIT_NOT_FOUND: {
        status: 404,
        message: 'Hábito não encontrado.'
    },
    HABIT_DELETE_FAILED: {
        status: 500,
        message: 'Erro ao eliminar o hábito.'
    },
    HABIT_UPDATE_FAILED: {
        status: 500,
        message: 'Erro ao atualizar hábito.'
    },
    HABIT_ALREADY_COMPLETED_TODAY: {
        status: 400,
        message: 'Hábito já foi concluído hoje.'
    },
    HABIT_ALREADY_COMPLETED_FOR_PERIOD: {
        status: 400,
        message: 'Hábito já foi concluído para o período da frequência.'
    },
    HABIT_COMPLETION_FAILED: {
        status: 500,
        message: 'Erro ao marcar hábito como concluído.'
    },

    //Achievement Management Errors
    FETCH_ACHIEVEMENTS_FAILED: {
        status: 500,
        message: 'Erro ao buscar conquistas.'
    },
    ACHIEVEMENT_INVALID_TYPE: {
        status: 400,    
        message: 'Tipo de conquista inválido.'
    },
    ACHIEVEMENT_MISSING_FIELDS: {
        status: 400,
        message: 'Todos os campos obrigatórios devem ser preenchidos.',
    },
    ACHIEVEMENT_ALREADY_EXISTS: {
        status: 409,
        message: 'Já existe uma conquista com esse nome.',
    },
    ACHIEVEMENT_INVALID_NAME_FOR_TYPE: {
        status: 400,
        message: 'Nome de conquista inválido para o tipo selecionado.',
    },
    ACHIEVEMENT_CREATION_FAILED: {
        status: 500,
        message: 'Erro ao criar conquista.',
    },
    ACHIEVEMENT_NOT_FOUND: {
        status: 404,
        message: 'Conquista não encontrada.',
    },
    ACHIEVEMENT_UPDATE_FAILED: {
        status: 500,
        message: 'Erro ao atualizar conquista.',
    },
    ACHIEVEMENT_DELETE_FAILED: {
        status: 500,
        message: 'Erro ao apagar conquista.',
    },  

    //Token Errors
    AUTH_TOKEN_MISSING: {
        message: 'Token não fornecido.',
        status: 401,
    },
    AUTH_TOKEN_INVALID: {
        message: 'Token inválido ou expirado.',
        status: 401,
    },

    //Admin Errors
    NOT_AUTHORIZED_ADMIN: {
        status: 403,
        message: 'Apenas administradores têm permissão para aceder a esta rota.'
    },
    GET_USERS_FAILED: {
        status: 500,
        message: 'Erro ao obter lista de utilizadores.',
    },
};

module.exports = errorHandler;
