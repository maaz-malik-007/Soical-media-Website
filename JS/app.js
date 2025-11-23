// // JS/app.js - Consolidated Logic for Social Media App

// // --- GLOBAL VARIABLES & INITIALIZATION ---

// // Initialize the Bootstrap Modal object for easy show/hide control
// // This assumes the modal HTML element with ID 'createPostModal' exists in index.html
// const postModal = new bootstrap.Modal(document.getElementById('createPostModal'));

// document.addEventListener('DOMContentLoaded', () => {
//     // 1. Initialize data in Local Storage if it doesn't exist
//     const initialPosts = [
//         { id: 1, user: "DevUser", timestamp: Date.now() - 3600000, content: "Welcome to SocialSphere! This feed is powered by Tailwind, Bootstrap, and GSAP.", likes: 10, isLiked: false },
//         { id: 2, user: "Jane_Admin", timestamp: Date.now() - 7200000, content: "Design tip: Using rounded corners and subtle shadows creates a clean, professional look.", likes: 25, isLiked: true }
//     ];

//     if (!localStorage.getItem('socialMediaPosts')) {
//         localStorage.setItem('socialMediaPosts', JSON.stringify(initialPosts));
//     }

//     // 2. Attach Post Creation Form listener
//     document.getElementById('post-creation-form').addEventListener('submit', createNewPost);

//     // 3. Attach Search and Filter listeners
//     document.getElementById('search-input').addEventListener('input', renderPosts);
//     document.getElementById('sort-filter').addEventListener('change', renderPosts);
    
//     // 4. Kick off the initial post rendering
//     renderPosts();
// });


// // --- DATA & UTILITY FUNCTIONS ---

// function getPosts() {
//     // Fetches and parses the posts array from Local Storage
//     const postsJSON = localStorage.getItem('socialMediaPosts');
//     return postsJSON ? JSON.parse(postsJSON) : [];
// }

// function savePosts(posts) {
//     // Stringifies and saves the posts array back to Local Storage
//     localStorage.setItem('socialMediaPosts', JSON.stringify(posts));
// }

// function formatTimestamp(timestamp) {
//     // Utility to convert timestamp to human-readable format (e.g., "1 hour ago")
//     const seconds = Math.floor((Date.now() - timestamp) / 1000);
//     let interval = Math.floor(seconds / 31536000);
//     if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");
//     interval = Math.floor(seconds / 2592000);
//     if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");
//     interval = Math.floor(seconds / 86400);
//     if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");
//     interval = Math.floor(seconds / 3600);
//     if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");
//     interval = Math.floor(seconds / 60);
//     if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");
//     return "just now";
// }

// function generatePostHTML(post) {
//     // Uses the <template> tag in index.html to create a new post card DOM element
//     const template = document.getElementById('post-template');
//     if (!template) {
//         console.error("Post template not found.");
//         return null;
//     }
    
//     const postClone = template.content.cloneNode(true).querySelector('.post-card');
    
//     // Fill in the post data using selector classes defined in the template
//     postClone.setAttribute('data-post-id', post.id);
//     postClone.querySelector('.post-initials').textContent = post.user.charAt(0).toUpperCase();
//     postClone.querySelector('.post-user').textContent = post.user;
//     postClone.querySelector('.post-timestamp').textContent = formatTimestamp(post.timestamp);
//     postClone.querySelector('.post-content').textContent = post.content;
//     postClone.querySelector('.like-count').textContent = post.likes;
    
//     const likeIcon = postClone.querySelector('.like-icon');
    
//     // Set like state based on data
//     if (post.isLiked) {
//         likeIcon.classList.add('text-red-500');
//         likeIcon.classList.remove('text-gray-400');
//     } else {
//         likeIcon.classList.add('text-gray-400');
//         likeIcon.classList.remove('text-red-500');
//     }
    
//     // Set data attributes required for interaction listeners
//     postClone.querySelector('.like-btn').setAttribute('data-like-id', post.id);
//     postClone.querySelector('.delete-btn').setAttribute('data-delete-id', post.id);

//     return postClone;
// }

// // --- FEATURE: POST CREATION ---

// function createNewPost(event) {
//     event.preventDefault(); 
    
//     const user = document.getElementById('post-user').value.trim() || 'Anonymous';
//     const content = document.getElementById('post-content').value.trim();
    
//     if (!content) {
//         window.alert("Post content cannot be empty.");
//         return;
//     }
    
//     const posts = getPosts();
//     // Generate a simple, unique ID
//     const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    
//     const newPost = {
//         id: newId,
//         user: user,
//         timestamp: Date.now(),
//         content: content,
//         likes: 0,
//         isLiked: false
//     };
    
//     posts.unshift(newPost); // Add to the beginning
//     savePosts(posts);
    
//     const postElement = generatePostHTML(newPost);
//     const postFeed = document.getElementById('post-feed');
    
//     if (postElement) {
//         // Insert new post at the top of the feed
//         postFeed.prepend(postElement);
    
//         // GSAP Animation: New post slides in
//         gsap.from(postElement, { 
//             opacity: 0, 
//             y: -50, 
//             duration: 0.6, 
//             ease: "power2.out" 
//         });

//         attachPostEventListeners(postElement); // Attach listener only to the new post
//     }
    
//     // Clear form and close modal
//     document.getElementById('post-creation-form').reset();
//     postModal.hide();
    
//     // Re-render to ensure search/sort is updated if applicable
//     renderPosts();
// }

// // --- FEATURE: LIKE SYSTEM ---

// function toggleLike(event) {
//     const postId = parseInt(event.currentTarget.getAttribute('data-like-id'));
//     let posts = getPosts();
    
//     const postIndex = posts.findIndex(p => p.id === postId);
//     if (postIndex === -1) return;
    
//     const post = posts[postIndex];
    
//     // 1. Update post data
//     if (post.isLiked) {
//         post.likes -= 1;
//     } else {
//         post.likes += 1;
//     }
//     post.isLiked = !post.isLiked;
    
//     savePosts(posts);
    
//     // 2. Update UI instantly
//     const cardElement = event.currentTarget.closest('.post-card');
//     const likeIcon = cardElement.querySelector('.like-icon');
//     const likeCount = cardElement.querySelector('.like-count');
    
//     // GSAP Animation for Like Feedback (pop effect)
//     gsap.to(likeIcon, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" });

//     likeCount.textContent = post.likes;
//     if (post.isLiked) {
//         likeIcon.classList.remove('text-gray-400');
//         likeIcon.classList.add('text-red-500');
//     } else {
//         likeIcon.classList.remove('text-red-500');
//         likeIcon.classList.add('text-gray-400');
//     }
// }

// // --- FEATURE: DELETE POST ---

// function deletePost(event) {
//     const postId = parseInt(event.currentTarget.getAttribute('data-delete-id'));
    
//     // Use window.confirm as a simple modal replacement
//     if (!window.confirm('Are you sure you want to permanently delete this post?')) {
//         return;
//     }

//     let posts = getPosts();
    
//     // Filter out the post to be deleted
//     const updatedPosts = posts.filter(p => p.id !== postId);
//     savePosts(updatedPosts);
    
//     // Remove the element from the DOM with a GSAP fade/slide out
//     const postElement = event.currentTarget.closest('.post-card');
    
//     gsap.to(postElement, {
//         opacity: 0,
//         x: 100, // Slide to the side while fading
//         scale: 0.9,
//         duration: 0.5,
//         onComplete: () => {
//             postElement.remove();
//             // Check if the feed is now empty and re-render if needed
//             if (document.getElementById('post-feed').children.length === 0) {
//                 renderPosts(); 
//             }
//         }
//     });
// }

// // --- FEATURE: SEARCH & SORTING/FILTERING ---

// function getFilteredAndSortedPosts() {
//     let posts = getPosts();
//     const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
//     const sortType = document.getElementById('sort-filter').value;

//     // 1. Filtering (Search)
//     if (searchTerm) {
//         posts = posts.filter(p => 
//             p.content.toLowerCase().includes(searchTerm) || 
//             p.user.toLowerCase().includes(searchTerm)
//         );
//     }

//     // 2. Sorting
//     switch (sortType) {
//         case 'oldest':
//             posts.sort((a, b) => a.timestamp - b.timestamp);
//             break;
//         case 'most_liked':
//             // Sort by likes, then by newest timestamp for ties
//             posts.sort((a, b) => b.likes - a.likes || b.timestamp - a.timestamp); 
//             break;
//         case 'latest':
//         default:
//             posts.sort((a, b) => b.timestamp - a.timestamp);
//             break;
//     }

//     return posts;
// }

// // --- RENDERING & EVENT MANAGEMENT ---

// function attachPostEventListeners(scope = document) {
//     // Finds and attaches listeners to like and delete buttons within the given scope
    
//     scope.querySelectorAll('.like-btn').forEach(button => {
//         // Remove existing listener to prevent duplicates after re-renders
//         button.removeEventListener('click', toggleLike);
//         button.addEventListener('click', toggleLike);
//     });

//     scope.querySelectorAll('.delete-btn').forEach(button => {
//         button.removeEventListener('click', deletePost);
//         button.addEventListener('click', deletePost);
//     });
// }

// function renderPosts() {
//     const postsToRender = getFilteredAndSortedPosts();
//     const postFeed = document.getElementById('post-feed');
    
//     // Clear the feed
//     postFeed.innerHTML = ''; 

//     if (postsToRender.length === 0) {
//         postFeed.innerHTML = '<p class="text-center text-gray-500 p-8 bg-white rounded-xl shadow-md">No posts found matching your criteria. Be the first to post!</p>';
//         return;
//     }

//     // Use DocumentFragment for efficient bulk DOM insertion
//     const fragment = document.createDocumentFragment();
//     postsToRender.forEach(post => {
//         const postElement = generatePostHTML(post);
//         if (postElement) {
//             fragment.appendChild(postElement);
//         }
//     });

//     postFeed.appendChild(fragment);

//     // Re-attach all listeners to the new posts
//     attachPostEventListeners();
// }