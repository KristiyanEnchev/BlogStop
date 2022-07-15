namespace Web.Controllers.Blog
{
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Authorization;

    using Shared;

    using Web.Extensions;

    using Application.Handlers.Tag.Commnads;
    using Application.Handlers.Tag.Queries;

    using Models.Blog;

    public class TagsController : ApiController
    {
        [HttpGet]
        [ProducesResponseType(typeof(Result<IReadOnlyList<TagDto>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<Result<IReadOnlyList<TagDto>>>> GetAll()
        {
            return await Mediator.Send(new GetAllTagsQuery()).ToActionResult();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Result<TagDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<TagDto>>> GetById(string id)
        {
            return await Mediator.Send(new GetTagByIdQuery(id)).ToActionResult();
        }

        [HttpPost]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(Result<TagDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Result<TagDto>>> Create([FromBody] CreateTagCommand command)
        {
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Result<bool>>> Update(string id, [FromBody] UpdateTagCommand command)
        {
            if (id != command.TagId)
            {
                return BadRequest(Result<bool>.Failure(new List<string> { "Tag ID mismatch." }));
            }
            return await Mediator.Send(command).ToActionResult();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        [ProducesResponseType(typeof(Result<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Result<bool>>> Delete(string id)
        {
            return await Mediator.Send(new DeleteTagCommand(id)).ToActionResult();
        }
    }
}
