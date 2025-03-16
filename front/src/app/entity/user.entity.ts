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
	PRODUCER = 'producer',
	VEHICLE_MANUFACTURER = 'vehicle_manufacturer',
	DISTRIBUTOR = 'distributor',
	OWNER = 'owner',
	RECYCLER = 'recycler',
  TRANSPORTER = "TRANSPORTER",
	}

