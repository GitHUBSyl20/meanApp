import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './posts.model'
import { stringify } from '@angular/compiler/src/util';

//js object to configure it 
//angular find it everywhere in the app and create a single instance of it
@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    //list of posts as a payload. 
    //New observable.
    private postsUpdated = new Subject<Post[]>()

    constructor(private http: HttpClient) { }

    getPosts() {
        //copy the array being imutable. 
        /* return [...this.posts];  */
        //get method extract and format the data for us
        this.http
            .get<{ message: string, posts: any }>(
                'http://localhost:3000/api/posts'
            )
            //intercepte le flux de data et modifie chaque element par mapping pour transformer la valeure de l'id
            .pipe(map((postData) => {
                return postData.posts.map(post => {
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
            .subscribe((transformedPosts) => {
                this.posts = transformedPosts;
                //informing the app aboout ther update:next() adding to the observable flux
                this.postsUpdated.next([...this.posts]);
            });
    }

    //object we can listen but not emit.
    //EAch time we add a post we should be able to get its content
    //since its private we cannot acces it to prevent other component to emit data with it
    //rendre dispo les posts à l'affichage dans la liste:
    getPostUpdateListener() {
        return this.postsUpdated.asObservable()
    }

    getPost(id: string){
        //renvoie un objet contenant le post dont l'id correspondant à celui rechercher
        //fait en parcourant les posts et eb utilisant fin
        /* return{...this.posts.find(p=>p.id === id)} */

        return this.http.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/'+id);
    }

    //ajouter post aux tableau:
    addPost(title: string, content: string) {
        //post is a constructor
        const post: Post = { id: null, title: title, content: content };
        //chemin et data que l'on transmet
        this.http
            .post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
            .subscribe(responseData => {
                const id = responseData.postId;
                //id fetched No overiding cause same object. 
                //Acces property inside the object not tje etnire object changeable therefore
                post.id = id
                //pushing it to local post after the request was successful : pesssimistic approach
                this.posts.push(post);
                //sending notification to the rest of the app
                this.postsUpdated.next([...this.posts]);
            });
    }

    updatePost(id: string, title: string, content: string){
        //js object
        const post: Post = {id: id, title: title, content: content}
        this.http.put('http://localhost:3000/api/posts/'+id, post)
        .subscribe(response=>{
            //make a copy of all the posts
            const updatedPosts = [...this.posts];
            //cherche l'id du vieux post que l'on édite (return true or false)`
            //if id of the post in the array is equal to the post edited with the id
            const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id)
            //avec cet id on définie le post mis à jour avec ses data comme étant le post updated
            //on le remplace dans la copie du tableau avec  le nouveau post
            updatedPosts[oldPostIndex]= post;
            //on remplace le tableau des posts par le  
            //nouveau tableau modifié dans lesquel on a changé le post avec l'id souhaité
            this.posts = updatedPosts;//immutable way to updating the new post
            //sending a copy of the updated post
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
        this.http
            .delete(`http://localhost:3000/api/posts/${postId}`)
            .subscribe(() => {
            //supress the posts which have the corresponding id and attribute the new table to the old
            const updatedPosts = this.posts.filter(post => post.id !== postId)
            this.posts = updatedPosts;
            //send a copy of this new array
            this.postsUpdated.next([...this.posts]);
        })
    }

    /* editPost(postId: string){
        console.log("edited in service")
        this.http
            .patch(`http://localhost:3000/api/posts/${postId}`)
            .subscribe(()=>{
            const updatedPosts = this.posts.filter(post => post.id !== postId)
            }) 
    }*/
}