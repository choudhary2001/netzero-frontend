import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

// Async thunks
export const fetchDepartments = createAsyncThunk(
    'admin/fetchDepartments',
    async (_, thunkAPI) => {
        try {
            return await adminService.getDepartments();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const createDepartment = createAsyncThunk(
    'admin/createDepartment',
    async (departmentData, thunkAPI) => {
        try {
            return await adminService.createDepartment(departmentData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateDepartment = createAsyncThunk(
    'admin/updateDepartment',
    async ({ id, data }, thunkAPI) => {
        try {
            return await adminService.updateDepartment(id, data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    'admin/deleteDepartment',
    async (id, thunkAPI) => {
        try {
            await adminService.deleteDepartment(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    departments: [],
    users: [],
    classes: [],
    stats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalDepartments: 0,
        totalClasses: 0
    },
    loading: false,
    error: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Departments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Department
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.departments.push(action.payload);
            })
            // Update Department
            .addCase(updateDepartment.fulfilled, (state, action) => {
                const index = state.departments.findIndex(dept => dept.id === action.payload.id);
                if (index !== -1) {
                    state.departments[index] = action.payload;
                }
            })
            // Delete Department
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.departments = state.departments.filter(dept => dept.id !== action.payload);
            });
    }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer; 