/* eslint-disable no-unused-vars */
import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { DiaryItemWithId } from '../models/DiaryItem'
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
/* eslint-enable no-unused-vars */

@Injectable({
    providedIn: 'root'
})
export class DiaryService {

    // eslint-disable-next-line no-unused-vars
    constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
    }

    private async getItemsCollectionForCurrentUser() {
        const currentUser = await this.auth.currentUser
        return this.firestore.collection(`/users/${currentUser.uid}/items`)
    }

    async getAllItems() {
        return await this.getItemsCollectionForCurrentUser()
    }
    
    async createItem(title: string, content: string) {
        return await (await this.getItemsCollectionForCurrentUser()).add({
            title,
            content,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }

    async updateItem(id: string, newTitle: string, newContent: string) {
        return await (await this.getItemsCollectionForCurrentUser()).doc(id).update({
            title: newTitle,
            content: newContent,
        })
    }

    async getItem(id: string): Promise<DiaryItemWithId> {
        const doc = await (await this.getItemsCollectionForCurrentUser()).doc(id).get().toPromise()
        const data = doc.data()
        if (!data) {
            return undefined
        }
        return {
            id: doc.id,
            title: data.title,
            content: data.content,
            createdAt: data.createdAt.toDate(),
        }
    }
}