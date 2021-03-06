import {BaseEntity} from './../interfaces/index'
import {bucket} from './../database/couchbase'

export abstract class Base {

    // use it getNextId
	abstract getCounterKey(): string

	// use it to form the key for a document
	abstract getKeyPrefix(): string

	abstract getType(): string

	// if a document's value is simply a number then couchbase has a special method called
	// counter which increments or decrements its value.
	// Below delta is positive 1 which means it increments the value by 1
	// initial is the value it uses if the key doesn't exists
	// result is an object with value and cas
	getNextId(key:string): Promise<number> {

		return new Promise((resolve, reject) => {
			bucket.counter(key, 1, {initial: 1}, (err, result) => {
				if(err)
					reject(err)

				resolve(result.value)
			})
		})

	}

	// takes in an object which atleast implements baseEntity and sets its values
	setMustHaves<T extends BaseEntity>(obj: T) {

		// getType is abstract method which will be implemented by each extending class
		obj.type = this.getType()
		if(!obj.createdAt)
			obj.createdAt = Date.now()

		obj.updatedAt = Date.now()

	}

	// stores a document in db which must atleast implement BaseEntity interface
	// result is a cas value
	saveKeyValue<T extends BaseEntity>(key: string, value: T) {

		return new Promise<T>((resolve, reject) => {
			bucket.insert(key, value, (err, result) => {
				if(err)
					return reject(err)

				return resolve(value)
			})
		})

	}

	getKey(id: number | string): string {
        return this.getKeyPrefix() + id.toString()
    }

	findValueByKey<T extends BaseEntity>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            bucket.get(key, (err: any, result: any) => {
                if (err)
                    return reject(err)

                return resolve(result.value)
            })
        })
    }

	findById<T extends BaseEntity>(id: number): Promise<T> {
        return this.findValueByKey(this.getKey(id))
    }

    protected async create<T extends BaseEntity>(obj: T, suffix?: string) {

		this.setMustHaves(obj)
		obj.id = await this.getNextId(this.getCounterKey())
		const key: string = this.getKeyPrefix() + (suffix || obj.id.toString())
		const result: T = await this.saveKeyValue(key, obj)
		return Promise.resolve(result)

	}

	replace<T extends BaseEntity>(object: T, keySuffix?: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!object.id)
                return reject('Missing id in the object')

            this.setMustHaves(object)
            let key = keySuffix ? this.getKeyPrefix() + keySuffix : this.getKey(object.id)

            bucket.replace(key, object, err => {
                if (err)
                    return reject(err)

                resolve(object)
            })
        })
    }
}