import { HttpException, HttpStatus } from '@nestjs/common';

export class ProjectAlreadyExistsException extends HttpException {
	constructor(message) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
