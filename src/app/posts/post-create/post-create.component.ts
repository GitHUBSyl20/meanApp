import { Component, OnInit /* EventEmitter,  Output */ } from '@angular/core';
/* import { Post } from '../posts.model'; */
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { PostsService } from '../posts.service';

import { Post } from '../posts.model'

//decorator to mark it as a component (gives features)
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  enteredContent = "";
  enteredTitle = "";
  post:Post;
  private mode = 'create';
  private postId: string;

  //activated route: provide acces to information about a route associated with a component
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    //checking if we have a post id parameter or not
    //paramMap is a built-in observable we need to subscribe to with no need to unsubscribe
    //the parameter in the url could change and thus it is an observable
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //callback,executed whenever the parameter change
      //we can listen to the route url
      if (paramMap.has('postId')) {
        //we are in the edit mode
        this.mode = 'edit';
        //the postId which is retrieved within paramMap object
        this.postId = paramMap.get('postId');
        //...is used to return to corresponding post thx to postsService getPost fction 
        this.postsService.getPost(this.postId).subscribe(postData=>{
          this.post = { id: postData._id, title: postData.title, content: postData.content}
        });
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onSavePost(form: NgForm){
    if (form.invalid) {
      return;
    }
    if(this.mode ==='create'){
      this.postsService.addPost(form.value.title, form.value.content);
    }else{
      this.postsService.updatePost(this.postId,form.value.title, form.value.content)
    }
    form.resetForm();
  }
}



 /*     const post: Post= {
          title: form.value.title, 
          content: form.value.content
        }; */
    //envoie l'event postCreated avec son paramètre
    /* this.postCreated.emit(post) */


   //to make it listenable to other components outside like app.component
/*  @Output () postCreated = new EventEmitter<Post>(); */