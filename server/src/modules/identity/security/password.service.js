import bcrypt from "bcrypt";

class PasswordService {
	constructor() {
		this.saltRounds = 12;
	}

	async hash(password) {
		return bcrypt.hash(password, this.saltRounds);
	}

	async compare(plainPassword, hashedPassword) {
		return bcrypt.compare(plainPassword, hashedPassword);
	}
}

export default new PasswordService();
