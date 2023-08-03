import * as React from 'react';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { API } from '../../api';
import { Box, Typography } from '@mui/material';
import { ScheduleVisit } from "../../types/domain";
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useAuthContext } from "@asgardeo/auth-react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ScheduleForm() {
    const navigate = useNavigate();
    const { getAccessToken } = useAuthContext();
    const { getDecodedIDToken } = useAuthContext();
    const [values, setValues] = useState({
        houseNo: "",
        visitorName: "",
        visitorNIC: "",
        visitorPhoneNo: "",
        vehicleNumber: "",
        visitDate: null,
        isApproved: false,
        comment: ""
    });

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    const handleDateChange = (newValue: any) => {
        setValues({
            ...values,
            visitDate: newValue
        });
    };

    const handleCheckboxChange = (event: { target: { name: any; checked: any; }; }) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked
        });
    };

    const handleFinish = async () => {
        const accessToken = await getAccessToken();
        API.post('/scheduledVisits', values, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response: AxiosResponse) => {
            const scheduleVisit: ScheduleVisit = response.data;
            navigate(`/visit/actual/${scheduleVisit.visitId}`);
        }).catch((error: any) => {
            console.log(error);
        });
    };


    const handleSubmit = (event: { preventDefault: () => void; }) => {
        handleFinish();
        event.preventDefault();
        console.log(values);
    };

    useEffect(() => {
    getDecodedIDToken()
      .then((decodedIDToken) => {
        setValues({ ...values, houseNo: decodedIDToken.houseno });
        console.log(decodedIDToken);
        })
      .catch((err) => console.error(err));
    }, []);

    return (
        <Box>
            <Typography variant="h4" component="div" gutterBottom>
                Schedule New Visit
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">

                <Stack spacing={2}>
                    <TextField name="visitorName" label="Visitor Name" value={values.visitorName} onChange={handleChange} />
                    <TextField name="visitorNIC" label="Visitor NIC" value={values.visitorNIC} onChange={handleChange} />
                    <TextField name="visitorPhoneNo" label="Visitor Phone Number" value={values.visitorPhoneNo} onChange={handleChange} />
                    <TextField name="vehicleNumber" label="Vehicle Number" value={values.vehicleNumber} onChange={handleChange} />
                    <TextField name="visitDate" label="Visit Date" value={values.visitDate} onChange={handleChange} />
                    <TextField name="comment" label="Comment" value={values.comment} onChange={handleChange} />
                </Stack>
                <br />
                <Button variant="contained" color="primary" type="submit">
                    Submit
                </Button>

            </form>
        </Box>
    );
}
