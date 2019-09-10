import { Post } from './posts.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

//js object to configure it 
//angular find it everywhere in the app and create a single instance of it
@Injectable({providedIn: 'root'})
export class PostsService {
    private posts : Post[]=[];
    //list of posts as a payload. 
    //New observable.
    private postsUpdated = new Subject<Post[]>()

    getPosts(){
        //copy the array being imutable. 
        return [...this.posts]; 
    }
//object we can listen but not emit.
//EAch time we add a post we should be able to get its content
//since its private we cannot acces it to prevent other component to emit data with it
    //rendre dispo les posts à l'affichage dans la liste:
    getPostUpdateListener(){
        return this.postsUpdated.asObservable()
    }
    //ajouter post aux tableau:
    addPost(title: string, content: string){
        const post: Post ={title: title, content: content}
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}