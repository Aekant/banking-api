export interface BaseEntity {
	id: number
	type: string
	createdAt: number
	updatedAt: number
}

export interface User extends BaseEntity {
    name: string
	identityNo: number
    accounts: Array<string>
}

export interface Account extends BaseEntity {
	balance: number,
	title: string,
	bank: string
	identityNo: number
}