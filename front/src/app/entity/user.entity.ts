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
  TRANSPORTER = "TRANSPORTER",//trtasnportista
	}

