import { HttpException, HttpStatus } from '@nestjs/common';

export class ProjectNotFoundException extends HttpException {
	constructor(message) {
		super(message, HttpStatus.NOT_FOUND);
	}
}
