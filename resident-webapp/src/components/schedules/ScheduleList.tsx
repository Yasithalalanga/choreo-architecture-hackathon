import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { API } from '../../api';
import { ScheduleVisit } from "../../types/domain"


export default function ScheduleList() {
    const [visits, setVisits] = useState<ScheduleVisit[] | undefined>(undefined);
  const [houseNo, setHouseNo] = useState<string | undefined>(undefined);
  const { getAccessToken, getDecodedIDToken } = useAuthContext();

    async function getVisits() {
        const accessToken = await getAccessToken();
        console.log(accessToken);

    let url: string = `/scheduledVisits/search?searchField=HOUSE_NO&value=${houseNo}`;

        API.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then((response) => {
                console.log(response);
                setVisits(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
  useEffect(() => {
    getDecodedIDToken()
      .then((decodedIDToken) => {
        setHouseNo(decodedIDToken.houseno);
      })
      .catch((err) => console.error(err));
  }, []);

    useEffect(() => {
        if (visits === undefined) {
            getVisits();
        }
  }, [visits, houseNo]);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" component="div" gutterBottom>
                My Scheduled Vists
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow style={{backgroundColor:'gray', color: 'white',}}>
                            <TableCell>Visitor Name</TableCell>
                            <TableCell>Visitor NIC</TableCell>
                            <TableCell>Visitor Phone No</TableCell>
                            <TableCell>Vehicle Number</TableCell>
                            <TableCell>Visit Date</TableCell>
                            <TableCell>Is Approved</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visits && visits.map((row) => (
                            <TableRow key={row.visitId}>
                                <TableCell>{row.visitorName}</TableCell>
                                <TableCell>{row.visitorNIC}</TableCell>
                                <TableCell>{row.visitorPhoneNo}</TableCell>
                                <TableCell>{row.vehicleNumber}</TableCell>
                                <TableCell>{row.visitDate}</TableCell>
                                <TableCell>{row.isApproved ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
