namespace Web.Controllers.Blog
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;

    using Application.Handlers.Blog.Commands;
    using Application.Handlers.Blog.Queries;

    using Web.Extensions;

    using Models.Blog;

    using Shared;

    public class BlogController : ApiController
    {
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Result<BlogPostDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<BlogPostDto>>> GetById(string id)
        {
            return await Mediator.Send(new GetBlogPostQuery(id)).ToActionResult();
        }

        [HttpGet]
        [ProducesResponseType(typeof(Result<PaginatedResult<BlogPostDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<PaginatedResult<BlogPostDto>>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery] string? tag = null,
            [FromQuery] string sortBy = "CreatedDate",
            [FromQuery] string order = "desc")
        {
            return await Mediator.Send(new GetBlogPostsQuery(page, pageSize, category, tag, sortBy, order)).ToActionResult();
        }

        [HttpPost]
        [ProducesResponseType(typeof(Result<BlogPostDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Result<BlogPostDto>>> Create([FromBody] BlogPostRequest request)
        {
            return await Mediator.Send(new CreateBlogPostCommand(request)).ToActionResult();
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<bool>>> Update(string id, [FromBody] BlogPostRequest request)
        {
            return await Mediator.Send(new UpdateBlogPostCommand(id, request)).ToActionResult();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<bool>>> Delete(string id)
        {
            return await Mediator.Send(new DeleteBlogPostCommand(id)).ToActionResult();
        }

        [HttpPost("{id}/toggle-like")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<bool>>> ToggleLike(string id)
        {
            return await Mediator.Send(new ToggleBlogPostLikeCommand(id, User.Identity!.Name! ?? "Anonimous")).ToActionResult();
        }

        [HttpGet("{postId}/comments")]
        [ProducesResponseType(typeof(Result<PaginatedResult<CommentDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<PaginatedResult<CommentDto>>>> GetComments(
            string postId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "CreatedDate",
            [FromQuery] string order = "desc")
        {
            return await Mediator.Send(new GetCommentsForPostQuery(postId, User.Identity!.Name! ?? "Anonimous", page, pageSize, sortBy, order)).ToActionResult();
        }

        [HttpPost("{postId}/comments")]
        [ProducesResponseType(typeof(Result<CommentDto>), StatusCodes.Status201Created)]
        public async Task<ActionResult<Result<CommentDto>>> CreateComment(string postId, [FromBody] CreateCommentCommand request)
        {
            return await Mediator.Send(new CreateCommentCommand(postId, User.Identity!.Name! ?? "Anonimous", request.Content, request.ParentCommentId)).ToActionResult();
        }

        [HttpPut("comments/{commentId}")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<bool>>> UpdateComment(string commentId, [FromBody] UpdateCommentCommand request)
        {
            return await Mediator.Send(new UpdateCommentCommand(commentId, User.Identity!.Name! ?? "Anonimous", request.NewContent)).ToActionResult();
        }

        [HttpDelete("comments/{commentId}")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<bool>>> DeleteComment(string commentId)
        {
            return await Mediator.Send(new DeleteCommentCommand(commentId)).ToActionResult();
        }

        [HttpPost("comments/{commentId}/toggle-like")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<bool>>> ToggleCommentLike(string commentId)
        {
            return await Mediator.Send(new ToggleCommentLikeCommand(commentId, User.Identity!.Name! ?? "Anonimous")).ToActionResult();
        }
    }
}