import styled from '@emotion/styled';
import { emotionTheme } from '@styles/themes/theme-new';

export const CourseBlockArea = styled.div<{
  height: string | undefined;
  top: string | undefined;
  left: string | undefined;
  backgroundColor: string | undefined;
}>`
  label: course-block-area;
  height: ${props => props.height};
  top: ${props => props.top};
  left: ${props => props.left};
  background-color: ${props => props.backgroundColor};
  position: absolute;
  width: calc(100% - 1px);
  margin-bottom: 1px;
  box-sizing: border-box;
  padding: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SubjectName = styled.div`
  label: subject-name;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  padding-top: 1px;
  color: ${emotionTheme.color.gray[900]};

  /* Medium: 1024px 이상, 1440px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Large}px) {
  }

  /* Small: 360px 이상, 1024px 미만 */
  @media (max-width: ${emotionTheme.breakpoints.values.Medium}px) {
    font-size: 12px;
    font-weight: 600;
  }
`;

export const ProfessorName = styled.div`
  label: professor-name;
  font-size: 10px;
  padding-top: 1px;
  color: ${emotionTheme.color.gray[800]};
`;

export const RoomName = styled.div`
  label: room-name;
  font-size: 10px;
  color: ${emotionTheme.color.gray[800]};
`;
