﻿namespace Models.User
{
    using Mapster;

    using Domain.Entities.Identity;

    public class UserDto : BaseIdentityAuditableDto<UserDto, User>, IMapFrom<User>
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public bool IsActive { get; set; }
        public string FullName { get; set; } = string.Empty;

        public void Mapping(TypeAdapterConfig config)
        {
            config.NewConfig<User, UserDto>()
                .Map(dest => dest.FullName, src => $"{src.FirstName} {src.LastName}")
                .IgnoreNullValues(true);
        }
    }
}
