/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogger, ILoggerService, log, LogLevel } from 'vs/platform/log/common/log';
import { URI } from 'vs/base/common/uri';

export class DelayedLogChannel {

	private readonly logger: ILogger;

	constructor(
		id: string, name: string, private readonly file: URI,
		@ILoggerService private readonly loggerService: ILoggerService,
	) {
		this.logger = loggerService.createLogger(file, { name, id, hidden: true });
	}

	log(level: LogLevel, message: string): void {
		this.loggerService.setVisibility(this.file, true);
		log(this.logger, level, message);
	}

}
