import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100vw;
  height: 99vh;
  display: flex;
  font-family: "Inter-SemiBold", Helvetica;
  flex-direction: column;
  align-items: center;
`;

export const FeedbackContainer = styled.div`
  width: 43%;
  height: 70.4%;
  background-color:#C683D7;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0 1%;

  @media (max-width: 768px) {
    width: 90%; /* Adjust for smaller screens */
    padding: 0 5%; /* Adjust padding for smaller screens */
  }
`;

export const TopDivider = styled.div`
  height: 21px;
  width: 100%;
  background-color:rgb(107, 107, 49);
  margin: 0;
`;

export const BtnContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 47px;
`;

export const PreferenceContainer = styled.div`
  width: 43%;
  margin: 28px 0 0; /*margin: top, right, bottom, left */
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

