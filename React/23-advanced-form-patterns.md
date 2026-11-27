# Advanced Form Patterns & Complex Forms

## Table of Contents
1. Dynamic Forms
2. Multi-step Forms
3. Form State Management
4. Advanced Validation
5. File Uploads
6. Conditional Fields
7. Array Fields (Repeating Fields)
8. Form Accessibility

---

## 1. Dynamic Forms

### Schema-Based Forms
```javascript
// Define form schema
const formSchema = [
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        validation: (value) => !value.includes('@') ? 'Invalid email' : null
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        required: true,
        validation: (value) => value.length < 8 ? 'Min 8 chars' : null
    },
    {
        name: 'rememberMe',
        type: 'checkbox',
        label: 'Remember me'
    }
];

// Render form from schema
function DynamicForm({ schema, onSubmit }) {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    
    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        schema.forEach(field => {
            if (field.required && !values[field.name]) {
                newErrors[field.name] = 'Required';
            }
            if (field.validation) {
                const error = field.validation(values[field.name]);
                if (error) newErrors[field.name] = error;
            }
        });
        
        if (Object.keys(newErrors).length === 0) {
            onSubmit(values);
        } else {
            setErrors(newErrors);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {schema.map(field => (
                <div key={field.name}>
                    <label>{field.label}</label>
                    <input
                        type={field.type}
                        name={field.name}
                        value={values[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                    {errors[field.name] && <span className="error">{errors[field.name]}</span>}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 2. Multi-step Forms

### Step-Based Form
```javascript
function MultiStepForm({ steps, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    
    const handleNext = (stepData) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        
        if (currentStep === steps.length - 1) {
            onComplete(formData);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
    };
    
    const CurrentStep = steps[currentStep];
    
    return (
        <div className="form-container">
            <div className="progress">
                Step {currentStep + 1} of {steps.length}
            </div>
            
            <CurrentStep
                data={formData}
                onNext={handleNext}
            />
            
            <div className="buttons">
                {currentStep > 0 && (
                    <button onClick={handlePrev}>Previous</button>
                )}
                <button onClick={() => handleNext(formData)}>
                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </button>
            </div>
        </div>
    );
}

// Usage
const steps = [
    function Step1({ data, onNext }) {
        const [name, setName] = useState(data.name || '');
        return (
            <div>
                <h2>Personal Info</h2>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                />
                <button onClick={() => onNext({ name })}>Next</button>
            </div>
        );
    },
    function Step2({ data, onNext }) {
        const [email, setEmail] = useState(data.email || '');
        return (
            <div>
                <h2>Contact Info</h2>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <button onClick={() => onNext({ email })}>Complete</button>
            </div>
        );
    }
];

<MultiStepForm steps={steps} onComplete={handleFormComplete} />
```

---

## 3. Form State Management

### Form Context
```javascript
// Create form context
const FormContext = createContext();

export function FormProvider({ initialValues, onSubmit, children }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await onSubmit(values);
        } catch (error) {
            setErrors({ submit: error.message });
        }
        
        setIsSubmitting(false);
    };
    
    return (
        <FormContext.Provider value={{
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit
        }}>
            {children}
        </FormContext.Provider>
    );
}

// Hook to use form context
export function useForm() {
    return useContext(FormContext);
}

// Usage
<FormProvider initialValues={{ email: '' }} onSubmit={handleSubmit}>
    <Form />
</FormProvider>

function Form() {
    const { values, handleChange, handleSubmit } = useForm();
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                value={values.email}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 4. Advanced Validation

### Yup Schema Validation
```javascript
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    email: yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: yup.string()
        .min(8, 'Min 8 characters')
        .required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Required'),
    age: yup.number()
        .min(18, 'Must be 18+')
        .max(120, 'Invalid age')
        .required('Required')
});

// Validate
async function handleSubmit(values) {
    try {
        await validationSchema.validate(values, { abortEarly: false });
        console.log('Form is valid');
    } catch (error) {
        console.log('Errors:', error.errors);
    }
}
```

### Custom Validators
```javascript
// Async validation
async function validateEmail(email) {
    const response = await fetch(`/api/validate-email?email=${email}`);
    const { available } = await response.json();
    return available ? null : 'Email already taken';
}

// Conditional validation
function validateForm(values) {
    const errors = {};
    
    if (!values.email) {
        errors.email = 'Required';
    }
    
    // Conditional - only validate if accountType is business
    if (values.accountType === 'business' && !values.companyName) {
        errors.companyName = 'Company name required for business accounts';
    }
    
    return errors;
}
```

---

## 5. File Uploads

### Single File Upload
```javascript
function FileUpload({ onUpload }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        
        if (!selectedFile) return;
        
        // Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('File too large');
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
            alert('Invalid file type');
            return;
        }
        
        setFile(selectedFile);
    };
    
    const handleUpload = async () => {
        if (!file) return;
        
        setUploading(true);
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const { url } = await response.json();
            onUpload(url);
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/jpeg,image/png"
            />
            {file && <p>{file.name}</p>}
            <button
                onClick={handleUpload}
                disabled={!file || uploading}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}
```

### Multiple File Upload
```javascript
function MultiFileUpload({ onUpload }) {
    const [files, setFiles] = useState([]);
    
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };
    
    const handleRemove = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleUpload = async () => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        
        const response = await fetch('/api/upload-multiple', {
            method: 'POST',
            body: formData
        });
        
        const { urls } = await response.json();
        onUpload(urls);
        setFiles([]);
    };
    
    return (
        <div>
            <input
                type="file"
                multiple
                onChange={handleFileSelect}
            />
            <ul>
                {files.map((file, i) => (
                    <li key={i}>
                        {file.name}
                        <button onClick={() => handleRemove(i)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleUpload} disabled={files.length === 0}>
                Upload {files.length} files
            </button>
        </div>
    );
}
```

---

## 6. Conditional Fields

### Show/Hide Fields
```javascript
function ConditionalForm() {
    const [formData, setFormData] = useState({
        accountType: 'personal'
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <form>
            <select name="accountType" value={formData.accountType} onChange={handleChange}>
                <option value="personal">Personal</option>
                <option value="business">Business</option>
            </select>
            
            {/* Show only for personal accounts */}
            {formData.accountType === 'personal' && (
                <input name="firstName" placeholder="First Name" />
            )}
            
            {/* Show only for business accounts */}
            {formData.accountType === 'business' && (
                <input name="companyName" placeholder="Company Name" />
            )}
        </form>
    );
}
```

---

## 7. Array Fields (Repeating Fields)

### Field Array
```javascript
function FormWithArrayFields() {
    const [items, setItems] = useState([{ name: '', email: '' }]);
    
    const handleItemChange = (index, field, value) => {
        setItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };
    
    const handleAddItem = () => {
        setItems(prev => [...prev, { name: '', email: '' }]);
    };
    
    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };
    
    return (
        <form>
            {items.map((item, index) => (
                <div key={index} className="item">
                    <input
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        placeholder="Name"
                    />
                    <input
                        value={item.email}
                        onChange={(e) => handleItemChange(index, 'email', e.target.value)}
                        placeholder="Email"
                    />
                    {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(index)}>
                            Remove
                        </button>
                    )}
                </div>
            ))}
            <button type="button" onClick={handleAddItem}>
                Add Item
            </button>
        </form>
    );
}
```

---

## 8. Form Accessibility

### Accessible Form
```javascript
function AccessibleForm() {
    return (
        <form>
            {/* Always link label to input */}
            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    aria-required="true"
                    aria-describedby="email-error"
                />
                <span id="email-error" className="error" role="alert">
                    Email is required
                </span>
            </div>
            
            {/* Fieldset for grouped options */}
            <fieldset>
                <legend>Account Type</legend>
                <div>
                    <input type="radio" id="personal" name="type" value="personal" />
                    <label htmlFor="personal">Personal</label>
                </div>
                <div>
                    <input type="radio" id="business" name="type" value="business" />
                    <label htmlFor="business">Business</label>
                </div>
            </fieldset>
            
            <button type="submit" aria-busy="false">
                Submit
            </button>
        </form>
    );
}
```

---

## Exercises

### Exercise 1: Dynamic Form from Schema
```javascript
// Create form that:
// - Renders from JSON schema
// - Validates on submit
// - Shows errors

// Your code
```

**Solution:**
```javascript
function DynamicForm({ schema, onSubmit }) {
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    
    const handleChange = (name, value) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        schema.forEach(field => {
            if (field.required && !values[field.name]) {
                newErrors[field.name] = 'Required';
            }
        });
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            onSubmit(values);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {schema.map(field => (
                <div key={field.name}>
                    <input
                        name={field.name}
                        value={values[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                    {errors[field.name] && <span>{errors[field.name]}</span>}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
}
```

### Exercise 2: Multi-step Form
```javascript
// Create 3-step form:
// - Step 1: Personal info
// - Step 2: Contact info
// - Step 3: Confirm

// Your code
```

**Solution:**
```javascript
const steps = [
    function Step1({ data, onNext }) {
        const [name, setName] = useState(data.name || '');
        return (
            <div>
                <input value={name} onChange={e => setName(e.target.value)} />
                <button onClick={() => onNext({ name })}>Next</button>
            </div>
        );
    },
    // ... more steps
];

function Form() {
    return <MultiStepForm steps={steps} onComplete={handleComplete} />;
}
```

### Exercise 3: Array Fields
```javascript
// Create form with:
// - Add more items
// - Remove items
// - Edit items

// Your code
```

**Solution:**
```javascript
function ArrayFieldsForm() {
    const [items, setItems] = useState([{ name: '' }]);
    
    const handleChange = (index, value) => {
        setItems(prev => {
            const updated = [...prev];
            updated[index] = { name: value };
            return updated;
        });
    };
    
    const handleAdd = () => setItems(prev => [...prev, { name: '' }]);
    
    const handleRemove = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };
    
    return (
        <form>
            {items.map((item, i) => (
                <div key={i}>
                    <input value={item.name} onChange={e => handleChange(i, e.target.value)} />
                    <button onClick={() => handleRemove(i)}>Remove</button>
                </div>
            ))}
            <button onClick={handleAdd}>Add</button>
        </form>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is form state management?**
A: Managing form values, errors, and submission state.

**Q2: Why use form libraries?**
A: Reduce boilerplate, handle validation, improve performance.

**Q3: How to handle array fields?**
A: Track items in state, add/remove dynamically.

**Q4: What about file uploads?**
A: Use FormData, validate size/type, show progress.

**Q5: How to make forms accessible?**
A: Link labels, use fieldset, add ARIA attributes.

---

## Summary

- **Dynamic Forms:** Schema-based generation
- **Multi-step:** Track step state and form data
- **State Management:** Form context or libraries
- **Validation:** Sync and async validation
- **Files:** FormData, validation, progress
- **Conditional:** Show/hide based on values
- **Array Fields:** Add/remove repeating items
- **Accessibility:** Labels, fieldsets, ARIA
- **Libraries:** Formik, React Hook Form, React Final Form
- **Testing:** Test validation, submission, errors

**Next:** Advanced routing patterns!
