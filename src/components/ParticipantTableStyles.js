import styled from "styled-components";


// export const ParticipantRectangle = styled.div`
//     width: 35.873px;
//     height: 23.743px;
//     flex-shrink: 0;
//     background: #DF1616; //Change color according to participant's response

// `
export const TableContainer = styled.div`
   position: 'fixed';
   top: '0';
   left: '0';
   right: '0';
   bottom: '0';
   display: 'flex';
   align-items: center;
   justify-content: center;
   margin-top: 100px;
   width: 60%; 
   padding: 0 20px; 
   
`
export const Table = styled.table`
  width: 100%; // Set the table width to 100%
`

export const TableRow = styled.tr`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px; // Add padding to control the row height and spacing
`

export const TableCell = styled.td`
  flex: 1; // Make the cells expand to fill available space equally
  padding-right: 30px;;
`