import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './posts.model'


//js object to configure it 
//angular find it everywhere in the app and create a single instance of it
@Injectable({providedIn: 'root'})
export class PostsService {
    private posts : Post[]=[];
    //list of posts as a payload. 
    //New observable.
    private postsUpdated = new Subject<Post[]>()

    constructor(private http : HttpClient){}

    getPosts(){
        //copy the array being imutable. 
        /* return [...this.posts];  */
        //get method extract and format the data for us
        this.http
        .get<{message: string, posts: any}>(
            'http://localhost:3000/api/posts'
        )
        //intercepte le flux de data et modifie chaque element par mapping pour transformer la valeure de l'id
        .pipe(map((postData)=>{
            return postData.posts.map(post=>{
                //every element of the array is converted into an object
                //put back into a new array
                //wrap into an observable 
                return {
                    title: post.title,
                    content: post.content, 
                    id: post._id
                }
            });
        }))
        //listening to the information needs subscribe
        //auto unsubcribe. Needs 3 argument, data, ending and errors
        .subscribe((transformedPosts)=>{
           this.posts = transformedPosts;
           //informing the app aboout ther update:next() adding to the observable flux
           this.postsUpdated.next([...this.posts]); 
        });
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
        //post is a constructor
        const post: Post ={id: null, title: title, content: content};
        //chemin et data que l'on transmet
        this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
        .subscribe((responseData)=>{
            console.log(responseData.message)
                  //pushing it to local post after the request was successful : pesssimistic approach
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }
}