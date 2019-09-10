import { Component, /* EventEmitter,  Output */} from '@angular/core';
/* import { Post } from '../posts.model'; */
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';

//decorator to mark it as a component (gives features)
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {

  enteredContent= "";
  enteredTitle="";
    //to make it listenable to other components outside like app.component
/*  @Output () postCreated = new EventEmitter<Post>(); */

  /* fakePost='first binding method' */
  constructor (public postsService : PostsService){}

/*   onAddPost(postInput: HTMLTextAreaElement){
    
    //console.dir() is the way to see all the properties of a specified 
    //JavaScript object in console by which the developer can easily get the properties of the object.
    console.dir(postInput)
 /*    this.fakePost=postInput.value 
   
  }  */

  onAddPostBetter(form: NgForm){
    if(form.invalid){
      return;
    }
/*     const post: Post= {
      title: form.value.title, 
      content: form.value.content
    }; */
    //envoie l'event postCreated avec son paramètre
    /* this.postCreated.emit(post) */
    this.postsService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

}
