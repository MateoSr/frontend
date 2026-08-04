import './inputForum.css'

function InputForum({label,id,type,value,onChange,placeholder,required,}){
    return(
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input 
            type={type} 
            id={id} 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            />
    </div>

)}

export default InputForum