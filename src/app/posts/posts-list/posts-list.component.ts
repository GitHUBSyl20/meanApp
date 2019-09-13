import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs';

import { Post } from '../posts.model';
import { PostsService } from '../posts.service'


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit, OnDestroy {
/*   posts = [
    {title: "first post", content: "thisi is the first post"},
    {title: "second post", content: "thisi is the second post"},
    {title: "third post", content: "thisi is the third post"},
  ] */

posts: Post[] = [];
private postsSub: Subscription;


/*   postsService: PostsService; 
  constructor(postsService: PostsService) { 
    this.postsService= postsService
  } */

//équivalent à :
// avec public keyword qui crée une 
//propriétés dans ce component et store les incoming values in the prop
  constructor(public postsService: PostsService) {}
 
  ngOnInit() {
    //triggering the fetching of new posts at loading component
    //getting new posts only if we reload the page!!!!
    this.postsService.getPosts();
    //rendering the posts
    this.postsSub=this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.posts= posts
    })
  }

  ngOnDestroy(){
    //avoid memory leak
    this.postsSub.unsubscribe();
  }

  onDelete(id: string){
    console.log("deleted", id)
    this.postsService.deletePost(id); 
  }

}
