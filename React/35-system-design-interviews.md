# System Design Interview Questions & Answers

## Table of Contents
1. Photo Sharing App
2. Real-time Chat Application
3. E-commerce Platform
4. Collaboration Tool
5. Analytics Dashboard
6. Social Media Feed
7. Video Streaming Platform
8. Interview Tips

---

## 1. Photo Sharing App (Instagram-like)

### Requirements
- Users upload and share photos
- Like, comment, share functionality
- Timeline / Feed
- Follow users
- Notifications
- Search functionality

### High-Level Architecture
```
Frontend:
├── Components
│   ├── Feed
│   ├── PhotoUpload
│   ├── UserProfile
│   ├── Comments
│   └── Notifications
├── State Management (Redux/Context)
├── API Client (Axios/Fetch)
└── Services (Auth, Upload)

Backend:
├── API Server (Node.js/Python)
├── Database (PostgreSQL)
├── Cache (Redis)
├── Storage (S3/CDN)
└── Message Queue (RabbitMQ)
```

### React Implementation
```javascript
// Feed Component
function Feed() {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    
    const { data: photoData, isLoading } = useQuery({
        queryKey: ['feed', page],
        queryFn: () => fetchFeed(page)
    });
    
    useEffect(() => {
        setPhotos(prev => [...prev, ...photoData]);
    }, [photoData]);
    
    return (
        <InfiniteScroll
            dataLength={photos.length}
            next={() => setPage(p => p + 1)}
            hasMore={photoData?.hasMore}
            loader={<Skeleton />}
        >
            {photos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} />
            ))}
        </InfiniteScroll>
    );
}

// Upload Component
function PhotoUpload() {
    const { mutate: upload } = useMutation({
        mutationFn: (file) => uploadPhoto(file),
        onSuccess: () => {
            invalidateQueries(['feed']);
            showNotification('Photo uploaded!');
        }
    });
    
    return (
        <div>
            <input 
                type="file" 
                onChange={(e) => upload(e.target.files[0])}
            />
        </div>
    );
}
```

### Key Challenges
1. **Image Optimization:** Compression, thumbnails, CDN delivery
2. **Scalability:** Millions of photos, users
3. **Real-time:** Notifications, live updates
4. **Consistency:** Database transactions for likes/comments
5. **Performance:** Pagination, caching, lazy loading

### Optimization Strategies
```javascript
// 1. Image optimization
const ImageComponent = ({ src }) => (
    <picture>
        <source srcSet={`${src}?w=300&h=300&fm=webp`} type="image/webp" />
        <source srcSet={`${src}?w=300&h=300`} type="image/jpeg" />
        <img src={src} alt="" loading="lazy" />
    </picture>
);

// 2. Pagination with cursor
const { data: photos } = useQuery({
    queryKey: ['feed', cursor],
    queryFn: () => fetchFeed({ cursor, limit: 20 }),
    keepPreviousData: true
});

// 3. Caching strategy
const feedCache = new Map();
const getCachedFeed = (page) => {
    const cached = feedCache.get(page);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        return cached.data;
    }
    return null;
};

// 4. Optimistic updates
const { mutate: likePhoto } = useMutation({
    mutationFn: (photoId) => api.likePhoto(photoId),
    onMutate: (photoId) => {
        // Optimistically update UI
        setPhotos(prev => 
            prev.map(p => p.id === photoId 
                ? { ...p, liked: true, likes: p.likes + 1 }
                : p
            )
        );
    },
    onError: () => {
        // Rollback on error
    }
});
```

---

## 2. Real-time Chat Application

### Requirements
- One-on-one and group messaging
- Real-time message delivery
- Typing indicators
- Online/offline status
- Message history
- Push notifications
- Encryption

### Architecture
```
Frontend (React):
├── Chat List
├── Message Thread
├── User List
├── Typing Indicator
└── Notifications

WebSocket Server:
├── Connection Management
├── Message Broadcasting
├── Presence Tracking
└── Acknowledgments

Database:
├── Messages
├── Users
├── Conversations
└── Attachments
```

### React Implementation
```javascript
// WebSocket Hook
function useWebSocket(url) {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        const ws = new WebSocket(url);
        
        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);
        ws.onerror = (error) => console.error(error);
        
        setSocket(ws);
        
        return () => ws.close();
    }, [url]);
    
    const send = (message) => {
        if (isConnected) {
            socket.send(JSON.stringify(message));
        }
    };
    
    return { socket, isConnected, send };
}

// Chat Component
function ChatThread({ conversationId }) {
    const [messages, setMessages] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);
    const { socket, send } = useWebSocket(WS_URL);
    
    useEffect(() => {
        socket?.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'message') {
                setMessages(prev => [...prev, data.message]);
            } else if (data.type === 'typing') {
                setTypingUsers(prev => [...prev, data.userId]);
            }
        });
    }, [socket]);
    
    const handleSendMessage = (text) => {
        const message = {
            id: uuid(),
            conversationId,
            text,
            timestamp: Date.now(),
            userId: currentUserId
        };
        
        // Optimistic update
        setMessages(prev => [...prev, message]);
        
        // Send to server
        send({
            type: 'message',
            message
        });
    };
    
    const handleTyping = () => {
        send({
            type: 'typing',
            conversationId,
            userId: currentUserId
        });
    };
    
    return (
        <div>
            <MessageList messages={messages} />
            {typingUsers.length > 0 && (
                <TypingIndicator users={typingUsers} />
            )}
            <MessageInput onSend={handleSendMessage} onType={handleTyping} />
        </div>
    );
}

// Typing Indicator Component
function TypingIndicator({ users }) {
    return (
        <div>
            {users.join(', ')} {users.length === 1 ? 'is' : 'are'} typing...
        </div>
    );
}
```

### Key Considerations
1. **Reliability:** Message delivery acknowledgment
2. **Scalability:** WebSocket servers, load balancing
3. **Persistence:** Store messages in database
4. **Encryption:** End-to-end encryption
5. **Performance:** Pagination, compression
6. **Offline:** Queue messages when offline

---

## 3. E-commerce Platform

### Requirements
- Browse products
- Shopping cart
- Checkout
- Payment processing
- Order tracking
- Reviews and ratings
- Recommendations
- Admin dashboard

### High-Level Architecture
```
Frontend (React):
├── ProductList (infinite scroll)
├── ProductDetail
├── CartSidebar
├── Checkout (multi-step)
├── OrderTracking
├── Reviews
└── AdminDashboard

Backend:
├── Product Service
├── Cart Service
├── Order Service
├── Payment Service
├── Inventory Service
└── Recommendation Engine

Third-party:
├── Stripe/PayPal (payment)
├── Shipping API
├── Email Service
└── Analytics
```

### React Implementation
```javascript
// Product List with Filters
function ProductList() {
    const [filters, setFilters] = useState({
        category: 'all',
        priceRange: [0, 1000],
        sort: 'popularity'
    });
    
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters),
        staleTime: 10 * 60 * 1000
    });
    
    return (
        <div className="layout">
            <Sidebar filters={filters} onFilterChange={setFilters} />
            <ProductGrid products={products} loading={isLoading} />
        </div>
    );
}

// Shopping Cart with Redux
const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [] },
    reducers: {
        addToCart: (state, action) => {
            const existing = state.items.find(
                i => i.id === action.payload.id
            );
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(i => i.id !== action.payload);
        },
        updateQuantity: (state, action) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) item.quantity = action.payload.quantity;
        }
    }
});

// Multi-step Checkout
function Checkout() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        shipping: {},
        payment: {},
        billing: {}
    });
    
    const { mutate: placeOrder } = useMutation({
        mutationFn: (data) => api.placeOrder(data),
        onSuccess: (order) => {
            navigate(`/order/${order.id}`);
        }
    });
    
    const handleNext = (stepData) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setStep(step + 1);
    };
    
    const handleSubmit = () => {
        placeOrder(formData);
    };
    
    return (
        <>
            <ProgressBar step={step} />
            {step === 1 && <ShippingForm onNext={handleNext} />}
            {step === 2 && <BillingForm onNext={handleNext} />}
            {step === 3 && <PaymentForm onSubmit={handleSubmit} />}
            {step === 4 && <OrderReview onConfirm={handleSubmit} />}
        </>
    );
}

// Product Reviews
function ProductReviews({ productId }) {
    const { data: reviews } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => fetchReviews(productId)
    });
    
    const { mutate: submitReview } = useMutation({
        mutationFn: (review) => api.submitReview(productId, review),
        onSuccess: () => {
            invalidateQueries(['reviews', productId]);
        }
    });
    
    return (
        <div>
            <ReviewForm onSubmit={submitReview} />
            <ReviewList reviews={reviews} />
        </div>
    );
}
```

### Critical Features
1. **Inventory Management:** Real-time stock tracking
2. **Payment Safety:** Stripe/PayPal integration
3. **Scalability:** Handle peak traffic (Black Friday)
4. **Search:** Elasticsearch for fast product search
5. **Recommendations:** ML-based product suggestions
6. **Performance:** Image optimization, caching

---

## 4. Collaboration Tool (Google Docs-like)

### Requirements
- Real-time document editing
- Conflict resolution
- Multiple user awareness
- Comments and suggestions
- Version history
- Sharing and permissions
- Offline support

### Complex Challenges
```javascript
// Operational Transformation for conflict resolution
class OT {
    transform(op1, op2) {
        // Transform operations so they can be applied in any order
        // Example: User A deletes char at index 5
        //          User B inserts char at index 3
        // Need to adjust positions correctly
    }
    
    compose(op1, op2) {
        // Combine two operations into one
    }
}

// CRDT Alternative (Conflict-free Replicated Data Type)
// Libraries: Yjs, Automerge
```

### React Implementation
```javascript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

function CollaborativeEditor({ docId }) {
    const editorRef = useRef(null);
    const [awareness, setAwareness] = useState(null);
    
    useEffect(() => {
        // Create shared document
        const ydoc = new Y.Doc();
        const ytext = ydoc.getText('shared-text');
        
        // Connect via WebSocket
        const provider = new WebsocketProvider(
            WS_URL,
            docId,
            ydoc
        );
        
        // Bind to editor
        const binding = new Y.UndoManager([ytext]);
        
        setAwareness(provider.awareness);
        
        return () => {
            provider.destroy();
        };
    }, [docId]);
    
    return (
        <div>
            <div ref={editorRef} />
            <Awareness awareness={awareness} />
            <Comments docId={docId} />
            <VersionHistory docId={docId} />
        </div>
    );
}

// User Awareness (who's editing, cursor position)
function Awareness({ awareness }) {
    const [users, setUsers] = useState(new Map());
    
    useEffect(() => {
        awareness.on('update', () => {
            const updatedUsers = new Map();
            awareness.getStates().forEach((state, clientId) => {
                updatedUsers.set(clientId, state.user);
            });
            setUsers(updatedUsers);
        });
    }, [awareness]);
    
    return (
        <div>
            {Array.from(users.values()).map(user => (
                <div key={user.clientId} style={{ color: user.color }}>
                    {user.name} is editing...
                </div>
            ))}
        </div>
    );
}
```

---

## Interview Tips & Strategies

### How to Approach
1. **Clarify Requirements** (5 min)
   - Ask about scale, users, features
   - Confirm functional and non-functional requirements

2. **High-Level Design** (10 min)
   - Draw system architecture
   - Components, services, databases
   - Explain flow

3. **Deep Dive** (10 min)
   - Choose important component
   - Explain implementation details
   - Discuss tradeoffs

4. **Scaling & Optimization** (5 min)
   - How to handle growth
   - Bottlenecks and solutions
   - Monitoring and debugging

### Common Questions
**Q: How would you handle 1M concurrent users?**
A: 
- Load balancing
- Database sharding
- Caching layers
- CDN for static content
- Message queues for async
- Database replication

**Q: How to ensure data consistency?**
A:
- ACID transactions
- Event sourcing
- Consensus algorithms (Raft, Paxos)
- Conflict resolution

**Q: How to make it scalable?**
A:
- Horizontal scaling
- Microservices
- Caching
- Database optimization
- Async processing

### Common Mistakes
- Overcomplicating too early
- Not clarifying requirements
- Forgetting about edge cases
- Not discussing tradeoffs
- Ignoring performance
- No monitoring/logging

### Good Practices
- Think out loud
- Ask clarifying questions
- Explain tradeoffs
- Discuss alternatives
- Consider scalability early
- Mention monitoring/debugging
- Be confident but open to feedback

---

## Exercises

### Exercise 1: Design Twitter
Features: Tweets, retweets, likes, followers, timeline, search

**Solution Sketch:**
```
Components: Feed, Tweet, Compose, Profile
State: Redux for global state, React Query for data
Backend: Tweet service, User service, Timeline service
Scaling: Tweet index (Elasticsearch), follower graph (Redis)
```

### Exercise 2: Design Uber
Features: Map, ride request, driver matching, pricing, payment

**Solution Sketch:**
```
Frontend: Map (Google Maps), ride details, payment
Backend: Matching algorithm, real-time location tracking
Scaling: Geospatial database, WebSocket for real-time updates
```

### Exercise 3: Design Video Platform
Features: Upload, streaming, comments, recommendations, search

**Solution Sketch:**
```
Frontend: Player, recommendations, comments
Backend: Video processing, CDN delivery, recommendation engine
Scaling: Video encoding queue, caching, load balancing
```

---

## Summary

- **Understand requirements** before designing
- **Think scalability** from the beginning
- **Consider tradeoffs** between consistency/availability
- **React-specific:** State management, real-time updates, optimization
- **Backend:** Database, caching, message queues
- **Third-party:** APIs, services, payment processors
- **Monitoring:** Logging, metrics, alerting
- **Testing:** Unit, integration, E2E
- **Communication:** Explain clearly, ask questions
- **Practice:** Build side projects, mock interviews

**Next: Final wrap-up and next steps!**
