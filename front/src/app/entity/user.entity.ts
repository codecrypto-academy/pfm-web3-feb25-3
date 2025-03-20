export interface User {
	id?: string;
	ethereumAddress: string;
	roles: string[];
	type?: UserType;
	firstName?: string;
	lastName?: string;
	companyName?: string;
}


export enum UserType {
	ADMIN = 'admin',
	USER = 'user',
	PRODUCER = 'producer', //fabrica
	//VEHICLE_MANUFACTURER = 'vehicle_manufacturer',
	DISTRIBUTOR = 'distributor',//rratiler
	OWNER = 'owner', //usuario 
	//RECYCLER = 'recycler',
	TRANSPORTER = "transporter",//trtasnportista
	}


	export enum RoleType {
		ADMIN = 'ROLE_ADMIN',
		USER = 'ROLE_USER',
		PRODUCER = 'ROLE_PRODUCER',
		TRANSPORT = 'ROLE_TRANSPORT',
		DISTRIBUTOR = "ROLE_DISTRIBUTOR",
		OWNER = "ROLE_OWNER",
	}

