package project_z.demo.dto.TitleDtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TitlePositionUpdateEventDto {
    private Long titleId;
    private Double customOrder;
}
