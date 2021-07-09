export interface BaseEntity {
	id: number
	type: string
	createdAt: number
	updatedAt: number
}

export interface User extends BaseEntity {
    name: string
    balance: string
}