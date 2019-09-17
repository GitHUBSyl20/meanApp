import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { PostCreateComponent }from './posts/post-create/post-create.component';


const routes: Routes = [
       { path: '', component: PostsListComponent },
       { path: 'create', component: PostCreateComponent},
       //different path -dynamic- routing to a same component
       { path: 'edit/:postId', component: PostCreateComponent}
]
 
@NgModule({ 
       imports: [RouterModule.forRoot(routes)],
       exports: [RouterModule]
})

export class AppRoutingModule {}