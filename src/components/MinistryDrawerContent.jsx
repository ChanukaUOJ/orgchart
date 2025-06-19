import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import colors from "../assets/colors";
import utils from "../utils/utils";
import { ClipLoader } from "react-spinners";
import api from "././../services/services";
import { useSelector } from "react-redux";

import { useThemeContext } from "../themeContext";

const MinistryDrawerContent = ({ selectedCard, selectedDate }) => {
  const { colors } = useThemeContext();

  const allPersonList = useSelector((state) => state.allPerson.allPerson);
  const allDepartmentList = useSelector(
    (state) => state.allDepartmentData.allDepartmentData
  );
  const { selectedMinistry } = useSelector((state) => state.allMinistryData);
  const { selectedPresident } = useSelector((state) => state.presidency);

  const [personListForMinistry, setPersonListForMinistry] = useState([]);
  const [departmentListForMinistry, setDepartmentListForMinistry] = useState(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPersonListAndDepListForMinistry(selectedMinistry);
  }, [selectedMinistry]);

  const clearCurrentLists = () => {
    setDepartmentListForMinistry([]);
    setPersonListForMinistry([]);
  };

  const fetchPersonListAndDepListForMinistry = async (selectedMinistry) => {
    try {
      setLoading(true);
      clearCurrentLists();
      const response1 = await api.fetchActiveRelationsForMinistry(
        selectedDate,
        selectedMinistry,
        "AS_APPOINTED"
      );
      const response2 = await api.fetchActiveRelationsForMinistry(
        selectedDate,
        selectedMinistry,
        "AS_DEPARTMENT"
      );

      const res1 = await response1.json();
      const res2 = await response2.json();

      const personSet = new Set(res1.map((person) => person.relatedEntityId));
      const departmentSet = new Set(
        res2.map((department) => department.relatedEntityId)
      );

      const personListInDetail = allPersonList.filter((person) => {
        return personSet.has(person.id);
      });

      const departmentListInDetail = allDepartmentList.filter((department) => {
        return departmentSet.has(department.id);
      });

      setPersonListForMinistry(personListInDetail);
      setDepartmentListForMinistry(departmentListInDetail);
      setLoading(false);
    } catch (e) {
      console.log(`Error fetching person list for mistry : `, e.message);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: colors.backgroundPrimary,
        mt: -5,
      }}
    >
      {/* Date */}
      <Typography
        variant="h6"
        sx={{ color: colors.textSecondary, fontFamily: "poppins" }}
      >
        Gazette Date
      </Typography>
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: colors.secondary,
            fontFamily: "poppins",
            fontWeight: "bold",
          }}
        >
          {selectedDate}
        </Typography>
      </Box>

      {/* Ministry Name */}
      <Box display="flex" alignItems="center" my={1}>
        <ApartmentIcon
          color={colors.textPrimary}
          sx={{ mr: 1, color: colors.backgroundSecondary }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: colors.textPrimary,
            fontFamily: "poppins",
          }}
        >
          {selectedCard.name.split(":")[0]}
        </Typography>
      </Box>

      <Divider sx={{ py: 1 }} />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <ClipLoader
            color={"#000000"}
            loading={loading}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : (
        <>
          {/* Ministers */}
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontSize: "1.25rem",
              color: colors.textPrimary,
              fontFamily: "poppins",
              fontWeight: 600
            }}
          >
            Minister
          </Typography>

          <Divider sx={{ py: 1 }} />

          <Stack spacing={1} sx={{ mb: 2 }}>
            {personListForMinistry && personListForMinistry.length > 0 ? (
              personListForMinistry?.map((dep, idx) => (
                <Button
                  key={idx}
                  variant="contained"
                  size="medium"
                  sx={{
                    p: 1,
                    boxShadow: "none",
                    justifyContent: "flex-start",
                    backgroundColor: colors.backgroundPrimary,
                    color: "primary.main",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.buttonLight,
                      boxShadow: "none",
                    },
                    border: `1px solid ${colors.backgroundPrimary}10`,
                  }}
                  fullWidth
                  // onClick={() => onDepartmentClick(dep)}
                >
                  <PersonIcon
                    fontSize="small"
                    sx={{ mr: 1, color: colors.backgroundSecondary }}
                  />
                  <Typography sx={{ fontFamily: "poppins",  color: colors.textPrimary  }}>
                    {utils.extractNameFromProtobuf(dep.name)}
                  </Typography>
                </Button>
              ))
            ) : (
              <Button
                variant="contained"
                size="medium"
                sx={{
                  p: 1,
                  boxShadow: "none",
                  justifyContent: "flex-start",
                  backgroundColor: colors.backgroundPrimary,
                  color: "primary.main",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: colors.buttonLight,
                    boxShadow: "none",
                  },
                  border: `1px solid ${colors.backgroundPrimary}10`,
                }}
                fullWidth
                // onClick={() => onDepartmentClick(dep)}
              >
                <PersonIcon
                  fontSize="small"
                  sx={{ mr: 1, color: colors.backgroundSecondary }}
                />
                <Typography sx={{ fontFamily: "poppins", color: colors.textPrimary }}>
                  {utils.extractNameFromProtobuf(selectedPresident.name)}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: colors.textSecondary,
                    fontFamily: "poppins",
                    py: "5px",
                    px: "8px",
                    backgroundColor: `${colors.green}50`,
                    borderRadius: "5px",
                    mx: "5px"
                  }}
                >
                  President
                </Typography>
              </Button>
            )}
          </Stack>
          {/* Departments */}
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              fontSize: "1.25rem",
              color: colors.textPrimary,
              fontFamily: "poppins",
              fontWeight: 600,
            }}
          >
            Departments
          </Typography>

          <Divider sx={{ py: 1 }} />
          <Stack spacing={1}>
            {departmentListForMinistry &&
            departmentListForMinistry.length > 0 ? (
              departmentListForMinistry?.map((dep, idx) => (
                <Button
                  key={idx}
                  variant="contained"
                  size="medium"
                  sx={{
                    p: 1,
                    boxShadow: "none",
                    justifyContent: "flex-start",
                    backgroundColor: colors.backgroundPrimary,
                    color: "primary.main",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.buttonLight,
                      boxShadow: "none",
                    },
                    border: `1px solid ${colors.backgroundPrimary}10`,
                    textAlign: "start",
                  }}
                  fullWidth
                  // onClick={() => onDepartmentClick(dep)}
                >
                  <AccountBalanceIcon
                    fontSize="small"
                    sx={{ mr: 2, color: colors.backgroundSecondary }}
                  />
                  <Typography sx={{ fontFamily: "poppins",  color: colors.textPrimary  }}>
                    {utils.extractNameFromProtobuf(dep.name)}
                  </Typography>
                </Button>
              ))
            ) : (
              <Box>
                <Alert
                  severity="info"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <AlertTitle>Info</AlertTitle>
                  No departments created for the ministry
                </Alert>
              </Box>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default MinistryDrawerContent;
