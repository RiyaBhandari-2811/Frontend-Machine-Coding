# React Forms & Validation

## Table of Contents
1. Controlled Components
2. Form Submission
3. Validation Techniques
4. Form Libraries (React Hook Form)
5. Complex Forms
6. File Upload
7. Best Practices
8. Common Patterns

---

## 1. Controlled Components

### Basic Controlled Input
```javascript
import { useState } from 'react';

// Controlled component - React controls input value
function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    return (
        <form>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
        </form>
    );
}

// Benefits:
// 1. React controls the data
// 2. Easy to validate
// 3. Easy to clear
// 4. Easy to populate
```

### Multiple Inputs Efficiently
```javascript
// ✗ VERBOSE - Separate state for each field
function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    return (
        <>
            <input value={name} onChange={e => setName(e.target.value)} />
            <input value={email} onChange={e => setEmail(e.target.value)} />
            <input value={phone} onChange={e => setPhone(e.target.value)} />
        </>
    );
}

// ✓ BETTER - Single handler with name attribute
function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    return (
        <>
            <input name="name" value={formData.name} onChange={handleChange} />
            <input name="email" value={formData.email} onChange={handleChange} />
            <input name="phone" value={formData.phone} onChange={handleChange} />
        </>
    );
}

// ✓ EVEN BETTER - Reusable input component
function FormInput({ name, value, onChange, label }) {
    return (
        <div>
            <label>{label}</label>
            <input name={name} value={value} onChange={onChange} />
        </div>
    );
}

function Form() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <>
            <FormInput name="name" value={formData.name} onChange={handleChange} label="Name" />
            <FormInput name="email" value={formData.email} onChange={handleChange} label="Email" />
        </>
    );
}
```

### Form Types
```javascript
// Text input
<input type="text" value={value} onChange={e => setValue(e.target.value)} />

// Textarea
<textarea value={text} onChange={e => setText(e.target.value)} />

// Select
<select value={selected} onChange={e => setSelected(e.target.value)}>
    <option value="">Choose...</option>
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
</select>

// Checkbox
<input
    type="checkbox"
    checked={isChecked}
    onChange={e => setIsChecked(e.target.checked)}
/>

// Radio
<input type="radio" checked={value === 'a'} onChange={() => setValue('a')} />

// Multiple select
function MultiSelect() {
    const [selected, setSelected] = useState([]);
    
    const handleChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelected(value);
    };
    
    return (
        <select multiple value={selected} onChange={handleChange}>
            <option value="a">A</option>
            <option value="b">B</option>
        </select>
    );
}
```

---

## 2. Form Submission

### Basic Form Submission
```javascript
function Form() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent page reload
        console.log('Form submitted:', formData);
        
        // Send to server
        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        // Reset form
        setFormData({ name: '', email: '' });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange} />
            <input name="email" value={formData.email} onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### Form with Loading State
```javascript
function Form() {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) throw new Error('Submit failed');
            
            setSuccess(true);
            setFormData({ name: '', email: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {success && <div className="success">Submitted!</div>}
            {error && <div className="error">{error}</div>}
            
            <input name="name" value={formData.name} onChange={handleChange} />
            <input name="email" value={formData.email} onChange={handleChange} />
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
}
```

---

## 3. Validation Techniques

### Client-side Validation
```javascript
// Validation rules
const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    }
    
    if (!formData.email.includes('@')) {
        errors.email = 'Invalid email';
    }
    
    if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
};

// Form with validation
function RegisterForm() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = validateForm(formData);
        
        if (Object.keys(newErrors).length === 0) {
            console.log('Form is valid, submit');
        } else {
            setErrors(newErrors);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
                <input name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div>
                <input name="password" type="password" value={formData.password} onChange={handleChange} />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
}
```

### Real-time Validation
```javascript
function Form() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    
    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        
        // Real-time validation
        if (!value.includes('@')) {
            setEmailError('Invalid email');
        } else {
            setEmailError('');
        }
    };
    
    return (
        <div>
            <input value={email} onChange={handleChange} />
            {emailError && <span className="error">{emailError}</span>}
        </div>
    );
}
```

---

## 4. Form Libraries - React Hook Form

### React Hook Form Basics
```javascript
import { useForm } from 'react-hook-form';

function RegisterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });
    
    const onSubmit = (data) => {
        console.log('Form data:', data);
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input {...register('name', { required: 'Name is required' })} />
                {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div>
                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+$/, message: 'Invalid email' }
                    })}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
            <div>
                <input
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Min 8 characters' }
                    })}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <button type="submit">Register</button>
        </form>
    );
}
```

### React Hook Form with Watch
```javascript
function PasswordForm() {
    const { register, watch, formState: { errors } } = useForm();
    const password = watch('password');
    
    return (
        <form>
            <input {...register('password', { required: true })} type="password" />
            <input
                {...register('confirmPassword', {
                    validate: value => value === password || 'Passwords must match'
                })}
                type="password"
            />
            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        </form>
    );
}
```

---

## 5. Complex Forms

### Multi-step Form
```javascript
function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        personalInfo: { name: '', email: '' },
        address: { street: '', city: '' },
        payment: { cardNumber: '' }
    });
    
    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };
    
    const handleNext = () => {
        // Validate current step
        if (validateStep(step, formData)) {
            setStep(step + 1);
        }
    };
    
    const handlePrevious = () => {
        setStep(step - 1);
    };
    
    const handleSubmit = () => {
        if (validateStep(3, formData)) {
            console.log('Submit:', formData);
        }
    };
    
    return (
        <div>
            {step === 1 && (
                <div>
                    <h2>Personal Info</h2>
                    <input
                        value={formData.personalInfo.name}
                        onChange={e => handleChange('personalInfo', 'name', e.target.value)}
                        placeholder="Name"
                    />
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2>Address</h2>
                    <input
                        value={formData.address.street}
                        onChange={e => handleChange('address', 'street', e.target.value)}
                        placeholder="Street"
                    />
                </div>
            )}
            {step === 3 && (
                <div>
                    <h2>Payment</h2>
                    <input
                        value={formData.payment.cardNumber}
                        onChange={e => handleChange('payment', 'cardNumber', e.target.value)}
                        placeholder="Card Number"
                    />
                </div>
            )}
            
            <div className="buttons">
                {step > 1 && <button onClick={handlePrevious}>Previous</button>}
                {step < 3 && <button onClick={handleNext}>Next</button>}
                {step === 3 && <button onClick={handleSubmit}>Submit</button>}
            </div>
        </div>
    );
}
```

### Dynamic Form Fields
```javascript
function DynamicForm() {
    const [fields, setFields] = useState([{ id: 1, value: '' }]);
    const [nextId, setNextId] = useState(2);
    
    const addField = () => {
        setFields(prev => [...prev, { id: nextId, value: '' }]);
        setNextId(nextId + 1);
    };
    
    const removeField = (id) => {
        setFields(prev => prev.filter(f => f.id !== id));
    };
    
    const handleChange = (id, value) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
    };
    
    return (
        <form>
            {fields.map(field => (
                <div key={field.id}>
                    <input
                        value={field.value}
                        onChange={e => handleChange(field.id, e.target.value)}
                    />
                    <button type="button" onClick={() => removeField(field.id)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={addField}>Add Field</button>
        </form>
    );
}
```

---

## 6. File Upload

### File Input
```javascript
function FileUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        // Show preview for images
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData  // Don't set Content-Type, browser does it
        });
        
        const result = await response.json();
        console.log('Upload result:', result);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" width="100" />}
            <button type="submit">Upload</button>
        </form>
    );
}
```

### Multiple File Upload
```javascript
function MultiFileUpload() {
    const [files, setFiles] = useState([]);
    
    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        
        const response = await fetch('/api/upload-multiple', {
            method: 'POST',
            body: formData
        });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="file" multiple onChange={handleFileChange} />
            <p>{files.length} files selected</p>
            <button type="submit">Upload All</button>
        </form>
    );
}
```

---

## 7. Best Practices

### Form Pattern
```javascript
// 1. Use controlled components
// 2. Validate on change and on submit
// 3. Show clear error messages
// 4. Disable submit while loading
// 5. Clear form on success
// 6. Consider form library for complex forms
// 7. Use proper input types (email, number, etc.)
// 8. Add accessibility (labels, ARIA)

function BestPracticeForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const validate = (data) => {
        const newErrors = {};
        if (!data.email) newErrors.email = 'Required';
        if (data.password.length < 8) newErrors.password = 'Min 8 chars';
        return newErrors;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = validate(formData);
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                await fetch('/api/submit', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                setFormData({ email: '', password: '' });
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
            
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                {errors.password && <span className="error">{errors.password}</span>}
            </div>
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
}
```

---

## Exercises

### Exercise 1: Validation
```javascript
// Create form with name, email, age validation
// Name: min 2 chars
// Email: valid format
// Age: 18-100

function RegistrationForm() {
    // Your code
}
```

**Solution:**
```javascript
function RegistrationForm() {
    const [formData, setFormData] = useState({ name: '', email: '', age: '' });
    const [errors, setErrors] = useState({});
    
    const validate = (data) => {
        const errors = {};
        if (data.name.length < 2) errors.name = 'Min 2 chars';
        if (!data.email.includes('@')) errors.email = 'Invalid email';
        if (data.age < 18 || data.age > 100) errors.age = 'Must be 18-100';
        return errors;
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            console.log('Valid form:', formData);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span>{errors.name}</span>}
            <input name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
            <input name="age" type="number" value={formData.age} onChange={handleChange} />
            {errors.age && <span>{errors.age}</span>}
            <button>Submit</button>
        </form>
    );
}
```

### Exercise 2: Dynamic Fields
```javascript
// Create form that adds/removes email fields
// At least 1 field, max 5

function EmailForm() {
    // Your code
}
```

**Solution:**
```javascript
function EmailForm() {
    const [emails, setEmails] = useState([{ id: 1, value: '' }]);
    const [nextId, setNextId] = useState(2);
    
    const addEmail = () => {
        if (emails.length < 5) {
            setEmails(prev => [...prev, { id: nextId, value: '' }]);
            setNextId(nextId + 1);
        }
    };
    
    const removeEmail = (id) => {
        if (emails.length > 1) {
            setEmails(prev => prev.filter(e => e.id !== id));
        }
    };
    
    const handleChange = (id, value) => {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, value } : e));
    };
    
    return (
        <div>
            {emails.map(email => (
                <div key={email.id}>
                    <input value={email.value} onChange={e => handleChange(email.id, e.target.value)} />
                    <button onClick={() => removeEmail(email.id)}>Remove</button>
                </div>
            ))}
            <button onClick={addEmail} disabled={emails.length >= 5}>Add Email</button>
        </div>
    );
}
```

### Exercise 3: File Upload with Preview
```javascript
// Create file upload with image preview
// Show file name and size

function ImageUpload() {
    // Your code
}
```

**Solution:**
```javascript
function ImageUpload() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target.result);
        };
        reader.readAsDataURL(selectedFile);
    };
    
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {file && <p>{file.name} ({Math.round(file.size / 1024)}KB)</p>}
            {preview && <img src={preview} alt="Preview" width="200" />}
        </div>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is controlled component?**
A: Component where React controls input value via state.

**Q2: Why prevent default on submit?**
A: To prevent page reload when form submitted.

**Q3: How to validate form?**
A: Check values against rules, store errors, show to user.

**Q4: What is React Hook Form?**
A: Library for efficient form state management with less re-renders.

**Q5: When to use form library?**
A: Complex forms, many fields, complex validation.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
<input value={value} onChange={e => setValue(e.target.value)} />
// Is this controlled?
```
A: Yes (React controls the value)

**Q2: Predict:**
```javascript
function handleSubmit(e) {
    // e.preventDefault() not called
}
// What happens on form submit?
```
A: Page reloads (default behavior)

**Q3: What is output?**
```javascript
const [files, setFiles] = useState([]);
<input type="file" onChange={e => setFiles(e.target.files)} />
// Can access files directly?
```
A: No (FileList, need Array.from)

**Q4: Spot the issue:**
```javascript
<input type="email" value={email} onChange={...} required />
// Should use HTML validation only?
```
A: No, need JS validation for server submission

**Q5: What is correct?**
```javascript
<input type="checkbox" checked={} onChange={e => setValue(e.target.checked)} />
// Which attribute to use?
```
A: `checked` not `value` for checkbox

---

## Follow-up Questions & Confusing Concepts

**Q: Why use controlled instead of uncontrolled?**
A: More control, easier validation, easier to clear/populate.

**Q: Can I mix controlled/uncontrolled?**
A: Not recommended (can cause issues).

**Q: How to handle multi-step forms?**
A: Track step in state, validate each step.

**Q: What about file uploads in FormData?**
A: Use FormData with fetch, don't stringify.

---

## Summary

- **Controlled Components**: React controls input value
- **onChange**: Track input changes
- **onSubmit**: Handle form submission
- **Validation**: Check values, store errors, display
- **preventDefault**: Stop page reload on submit
- **FormData**: For file uploads
- **React Hook Form**: Library for efficient forms
- **Multi-step Forms**: Track step, validate each step
- **File Upload**: Use FileReader for previews
- **Accessibility**: Use labels, ARIA attributes

**Next Step:** Master routing and navigation!
