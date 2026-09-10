package project_z.demo.dto.TitleDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TitlePositionUpdateDto {
    private Double customOrder;
    private Integer newIndex;
    private String sortMode;
}
