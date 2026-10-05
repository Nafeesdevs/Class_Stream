// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import courseService from "../../services/courseService";
// import categoryService from "../../services/categoryService";
// import classService from "../../services/classService";
// import CourseCard from "../../components/common/CourseCard";
// import { CourseSkeletonCard } from "../../components/common/LoadingSkeleton";
// import EmptyState from "../../components/common/EmptyState";
// import {
//   Search,
//   Filter,
//   X,
//   SlidersHorizontal,
//   ChevronRight,
//   BookOpen,
//   Check,
// } from "lucide-react";

// export const CourseCatalogPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filters state from URL query or defaults
//   const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
//   const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
//   const [selectedClass, setSelectedClass] = useState(searchParams.get("courseClass") || "");
//   const [selectedAccess, setSelectedAccess] = useState(searchParams.get("access") || "");
//   const [sortBy, setSortBy] = useState("latest");
//   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

//   // Synchronize when URL search parameters change
//   useEffect(() => {
//     if (searchParams.get("keyword") !== null) {
//       setKeyword(searchParams.get("keyword"));
//     }
//     if (searchParams.get("category") !== null) {
//       setSelectedCategory(searchParams.get("category"));
//     }
//   }, [searchParams]);

//   // Load initial filter options
//   useEffect(() => {
//     const loadFilterOptions = async () => {
//       try {
//         const [catRes, classRes] = await Promise.all([
//           categoryService.getAllCategories(),
//           classService.getAllClasses(),
//         ]);
//         if (catRes?.category) setCategories(catRes.category);
//         if (classRes?.classes) setClasses(classRes.classes);
//       } catch (err) {
//         console.warn("Could not load categories or classes:", err);
//       }
//     };
//     loadFilterOptions();
//   }, []);

//   // Fetch courses on filter state changes
//   useEffect(() => {
//     const fetchFilteredCourses = async () => {
//       setLoading(true);
//       try {
//         const params = {};
//         if (keyword.trim()) params.keyword = keyword.trim();
//         if (selectedCategory) params.category = selectedCategory;
//         if (selectedClass) params.courseClass = selectedClass;

//         const res = await courseService.getAllCourses(params);
//         let list = res?.courses || [];

//         // Filter by access type client-side if needed
//         if (selectedAccess === "free") {
//           list = list.filter((c) => !c.isPaid || c.price === 0);
//         } else if (selectedAccess === "paid") {
//           list = list.filter((c) => c.isPaid && c.price > 0);
//         } else if (selectedAccess === "trial") {
//           list = list.filter((c) =>
//             c.courseVideo?.some((v) => v.accessType === "trial" || v.accessType === "free")
//           );
//         }

//         // Sorting
//         if (sortBy === "price-low") {
//           list.sort((a, b) => (a.price || 0) - (b.price || 0));
//         } else if (sortBy === "price-high") {
//           list.sort((a, b) => (b.price || 0) - (a.price || 0));
//         } else if (sortBy === "rating") {
//           list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//         }

//         setCourses(list);
//       } catch (err) {
//         console.warn("Course fetch error:", err);
//         setCourses([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilteredCourses();
//   }, [keyword, selectedCategory, selectedClass, selectedAccess, sortBy]);

//   const handleResetFilters = () => {
//     setKeyword("");
//     setSelectedCategory("");
//     setSelectedClass("");
//     setSelectedAccess("");
//     setSortBy("latest");
//     setSearchParams({});
//   };

//   const hasActiveFilters = !!(keyword || selectedCategory || selectedClass || selectedAccess);

//   return (
//     <div className="container animate-fade-in responsive-page course-catalog-page" style={{ paddingTop: "2.5rem", paddingBottom: "5rem" }}>
//       {/* Header & Search Banner */}
//       <div
//         style={{
//           marginBottom: "2.5rem",
//           background: "radial-gradient(ellipse at 50% -50%, rgba(37, 99, 235, 0.09) 0%, rgba(248, 250, 252, 0.5) 60%, transparent 100%)",
//           padding: "2rem 2.25rem",
//           borderRadius: "var(--radius-xl)",
//           border: "1px solid var(--border)",
//           boxShadow: "var(--shadow-xs)",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.65rem" }}>
//           <span>Home</span>
//           <ChevronRight size={14} />
//           <span style={{ color: "var(--text-main)", fontWeight: 600 }}>Courses</span>
//         </div>
//         <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem" }}>
//           <div>
//             <h1
//               style={{
//                 fontSize: "2.5rem",
//                 fontFamily: "var(--font-heading)",
//                 fontWeight: 800,
//                 letterSpacing: "-0.03em",
//                 color: "var(--text-main)",
//                 marginBottom: "0.4rem",
//               }}
//             >
//               Course <span className="gradient-text-hero">Catalog</span>
//             </h1>
//             <p style={{ color: "var(--text-body)", maxWidth: "600px", fontSize: "1rem", lineHeight: 1.6 }}>
//               Explore high-definition course tracks with free preview videos, verified syllabi, and industry-grade certifications.
//             </p>
//           </div>

//           {/* Quick Search with Premium Glow */}
//           <div style={{ width: "100%", maxWidth: "380px" }}>
//             <div
//               className="input-with-icon"
//               style={{
//                 background: "#ffffff",
//                 boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
//                 borderRadius: "var(--radius-full)",
//               }}
//             >
//               <Search className="input-icon-left" size={18} color="var(--primary)" />
//               <input
//                 type="text"
//                 placeholder="Search course title or instructor..."
//                 value={keyword}
//                 onChange={(e) => setKeyword(e.target.value)}
//                 className="form-control"
//                 style={{ borderRadius: "var(--radius-full)", paddingLeft: "2.6rem" }}
//               />
//               {keyword && (
//                 <button
//                   type="button"
//                   className="input-icon-right"
//                   onClick={() => setKeyword("")}
//                   style={{ background: "none", border: "none" }}
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Filter Pill Chips */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "0.5rem",
//             flexWrap: "wrap",
//             marginTop: "1.5rem",
//             paddingTop: "1.25rem",
//             borderTop: "1px solid var(--border)",
//           }}
//         >
//           <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "0.25rem" }}>
//             Tracks:
//           </span>
//           <button
//             type="button"
//             onClick={() => setSelectedCategory("")}
//             style={{
//               padding: "0.35rem 0.85rem",
//               borderRadius: "var(--radius-full)",
//               fontSize: "0.82rem",
//               fontWeight: 600,
//               cursor: "pointer",
//               transition: "all var(--transition-fast)",
//               border: !selectedCategory ? "1px solid var(--primary)" : "1px solid var(--border)",
//               background: !selectedCategory ? "var(--primary)" : "#ffffff",
//               color: !selectedCategory ? "#ffffff" : "var(--text-body)",
//               boxShadow: !selectedCategory ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
//             }}
//           >
//             All Disciplines
//           </button>
//           {categories.map((cat) => {
//             const isSelected = selectedCategory === cat.categoryName;
//             return (
//               <button
//                 key={cat._id}
//                 type="button"
//                 onClick={() => setSelectedCategory(isSelected ? "" : cat.categoryName)}
//                 style={{
//                   padding: "0.35rem 0.85rem",
//                   borderRadius: "var(--radius-full)",
//                   fontSize: "0.82rem",
//                   fontWeight: 600,
//                   cursor: "pointer",
//                   transition: "all var(--transition-fast)",
//                   border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
//                   background: isSelected ? "var(--primary)" : "#ffffff",
//                   color: isSelected ? "#ffffff" : "var(--text-body)",
//                   boxShadow: isSelected ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
//                 }}
//               >
//                 {cat.categoryName}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Main Grid: Sidebar Filters + Course Cards */}
//       <div
//         className="catalog-layout"
//         style={{
//           display: "flex",
//           gap: "2.25rem",
//           alignItems: "flex-start",
//         }}
//       >
//         {/* Desktop Sidebar Filters */}
//         <aside
//           className="catalog-sidebar"
//           // style={{
//           //   width: "280px",
//           //   flexShrink: 0,
//           //   background: "var(--surface)",
//           //   padding: "1.5rem",
//           //   borderRadius: "var(--radius-lg)",
//           //   border: "1px solid var(--border)",
//           //   boxShadow: "var(--shadow-xs)",
//           // }}
//           style={{
//   width: "280px",
//   flexShrink: 0,
//   background: "var(--surface)",
//   padding: "1.5rem",
//   borderRadius: "var(--radius-lg)",
//   border: "1px solid var(--border)",
//   boxShadow: "var(--shadow-xs)",
//   position: "sticky",
//   top: "90px",
//   alignSelf: "flex-start",
//   height: "fit-content",
// }}
//         >
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", paddingBottom: "0.85rem", borderBottom: "1px solid var(--border-light)" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.05rem" }}>
//               <Filter size={18} color="var(--primary)" />
//               <span>Filters</span>
//             </div>
//             {hasActiveFilters && (
//               <button
//                 onClick={handleResetFilters}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "0.8rem",
//                   color: "var(--primary)",
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 Reset All
//               </button>
//             )}
//           </div>

//           {/* Category Filter */}
//           <div style={{ marginBottom: "1.75rem" }}>
//             <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
//               Category
//             </label>
//             <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
//               <button
//                 onClick={() => setSelectedCategory("")}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   background: !selectedCategory ? "var(--primary-light)" : "none",
//                   color: !selectedCategory ? "var(--primary)" : "var(--text-main)",
//                   border: "none",
//                   padding: "0.45rem 0.65rem",
//                   borderRadius: "var(--radius-sm)",
//                   fontSize: "0.9rem",
//                   fontWeight: !selectedCategory ? 700 : 500,
//                   cursor: "pointer",
//                   textAlign: "left",
//                 }}
//               >
//                 <span>All Categories</span>
//                 {!selectedCategory && <Check size={16} />}
//               </button>
//               {categories.map((cat) => (
//                 <button
//                   key={cat._id}
//                   onClick={() => setSelectedCategory(cat.categoryName)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     background: selectedCategory === cat.categoryName ? "var(--primary-light)" : "none",
//                     color: selectedCategory === cat.categoryName ? "var(--primary)" : "var(--text-main)",
//                     border: "none",
//                     padding: "0.45rem 0.65rem",
//                     borderRadius: "var(--radius-sm)",
//                     fontSize: "0.9rem",
//                     fontWeight: selectedCategory === cat.categoryName ? 700 : 500,
//                     cursor: "pointer",
//                     textAlign: "left",
//                   }}
//                 >
//                   <span>{cat.categoryName}</span>
//                   {selectedCategory === cat.categoryName && <Check size={16} />}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Class Level Filter */}
//           <div style={{ marginBottom: "1.75rem" }}>
//             <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
//               Class / Proficiency
//             </label>
//             <select
//               value={selectedClass}
//               onChange={(e) => setSelectedClass(e.target.value)}
//               className="form-control"
//               style={{ marginTop: "0.5rem" }}
//             >
//               <option value="">All Levels</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls.className}>
//                   {cls.className}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Access Type Filter */}
//           <div style={{ marginBottom: "1.75rem" }}>
//             <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
//               Access Type
//             </label>
//             <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.5rem" }}>
//               {[
//                 { id: "", label: "All Formats" },
//                 { id: "free", label: "Free Courses" },
//                 { id: "paid", label: "Premium Tracks" },
//                 { id: "trial", label: "Trial Video Available" },
//               ].map((acc) => (
//                 <label
//                   key={acc.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "0.6rem",
//                     fontSize: "0.9rem",
//                     cursor: "pointer",
//                     color: "var(--text-main)",
//                   }}
//                 >
//                   <input
//                     type="radio"
//                     name="accessType"
//                     checked={selectedAccess === acc.id}
//                     onChange={() => setSelectedAccess(acc.id)}
//                     style={{ accentColor: "var(--primary)" }}
//                   />
//                   <span>{acc.label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Courses Area */}
//         <main style={{ flex: 1 }}>
//           {/* Top Sort & Count Bar */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: "1.5rem",
//               background: "var(--surface)",
//               padding: "0.85rem 1.25rem",
//               borderRadius: "var(--radius-md)",
//               border: "1px solid var(--border)",
//             }}
//           >
//             <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
//               Showing <strong style={{ color: "var(--text-main)" }}>{courses.length}</strong> available courses
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
//               <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Sort by:</span>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="form-control"
//                 style={{ width: "auto", padding: "0.35rem 0.85rem", fontSize: "0.85rem" }}
//               >
//                 <option value="latest">Latest Released</option>
//                 <option value="rating">Top Rated</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Active Filter Tags */}
//           {hasActiveFilters && (
//             <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
//               {selectedCategory && (
//                 <span className="badge badge-primary" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
//                   Category: {selectedCategory}
//                   <X size={13} style={{ cursor: "pointer" }} onClick={() => setSelectedCategory("")} />
//                 </span>
//               )}
//               {selectedClass && (
//                 <span className="badge badge-primary" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
//                   Level: {selectedClass}
//                   <X size={13} style={{ cursor: "pointer" }} onClick={() => setSelectedClass("")} />
//                 </span>
//               )}
//               {selectedAccess && (
//                 <span className="badge badge-sub" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
//                   Access: {selectedAccess}
//                   <X size={13} style={{ cursor: "pointer" }} onClick={() => setSelectedAccess("")} />
//                 </span>
//               )}
//               {keyword && (
//                 <span className="badge badge-gray" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
//                   Keyword: "{keyword}"
//                   <X size={13} style={{ cursor: "pointer" }} onClick={() => setKeyword("")} />
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Course Cards Grid */}
//           {loading ? (
//             <div className="grid-3">
//               {[1, 2, 3, 4, 5, 6].map((i) => (
//                 <CourseSkeletonCard key={i} />
//               ))}
//             </div>
//           ) : courses.length > 0 ? (
//             <div className="grid-3">
//               {courses.map((course) => (
//                 <CourseCard key={course._id} course={course} />
//               ))}
//             </div>
//           ) : (
//             <EmptyState
//               icon={BookOpen}
//               title="No courses match your criteria"
//               description="Try clearing some of your selected filters or search terms to see more available curriculum tracks."
//               actionText="Clear All Filters"
//               onAction={handleResetFilters}
//             />
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default CourseCatalogPage;

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import courseService from "../../services/courseService";
import categoryService from "../../services/categoryService";
import classService from "../../services/classService";
import CourseCard from "../../components/common/CourseCard";
import { CourseSkeletonCard } from "../../components/common/LoadingSkeleton";
import EmptyState from "../../components/common/EmptyState";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Check,
} from "lucide-react";

export const CourseCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL query or defaults
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedClass, setSelectedClass] = useState(searchParams.get("courseClass") || "");
  const [selectedAccess, setSelectedAccess] = useState(searchParams.get("access") || "");
  const [sortBy, setSortBy] = useState("latest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize when URL search parameters change
  useEffect(() => {
    if (searchParams.get("keyword") !== null) {
      setKeyword(searchParams.get("keyword"));
    }
    if (searchParams.get("category") !== null) {
      setSelectedCategory(searchParams.get("category"));
    }
  }, [searchParams]);

  // Load initial filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [catRes, classRes] = await Promise.all([
          categoryService.getAllCategories(),
          classService.getAllClasses(),
        ]);
        if (catRes?.category) setCategories(catRes.category);
        if (classRes?.classes) setClasses(classRes.classes);
      } catch (err) {
        console.warn("Could not load categories or classes:", err);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch courses on filter state changes
  useEffect(() => {
    const fetchFilteredCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (keyword.trim()) params.keyword = keyword.trim();
        if (selectedCategory) params.category = selectedCategory;
        if (selectedClass) params.courseClass = selectedClass;

        const res = await courseService.getAllCourses(params);
        let list = res?.courses || [];

        // Filter by access type client-side if needed
        if (selectedAccess === "free") {
          list = list.filter((c) => !c.isPaid || c.price === 0);
        } else if (selectedAccess === "paid") {
          list = list.filter((c) => c.isPaid && c.price > 0);
        } else if (selectedAccess === "trial") {
          list = list.filter((c) =>
            c.courseVideo?.some((v) => v.accessType === "trial" || v.accessType === "free")
          );
        }

        // Sorting
        if (sortBy === "price-low") {
          list.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === "price-high") {
          list.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === "rating") {
          list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setCourses(list);
      } catch (err) {
        console.warn("Course fetch error:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredCourses();
  }, [keyword, selectedCategory, selectedClass, selectedAccess, sortBy]);

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedCategory("");
    setSelectedClass("");
    setSelectedAccess("");
    setSortBy("latest");
    setSearchParams({});
  };

  const hasActiveFilters = !!(keyword || selectedCategory || selectedClass || selectedAccess);

  return (
    <div
      className="container animate-fade-in responsive-page course-catalog-page"
      style={{
        // Wider layout: removes the large left/right white space of the default container
        maxWidth: "none",
        width: "100%",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        paddingTop: "1.75rem",
        paddingBottom: "4rem",
      }}
    >
      {/* Header & Search Banner */}
      <div
        style={{
          marginBottom: "1.75rem",
          background: "radial-gradient(ellipse at 50% -50%, rgba(37, 99, 235, 0.09) 0%, rgba(248, 250, 252, 0.5) 60%, transparent 100%)",
          padding: "1.6rem 1.9rem",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.55rem" }}>
          <span>Home</span>
          <ChevronRight size={14} />
          <span style={{ color: "var(--text-main)", fontWeight: 600 }}>Courses</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1.25rem" }}>
          <div>
            <h1
              style={{
                fontSize: "2.4rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-main)",
                marginBottom: "0.35rem",
              }}
            >
              Course <span className="gradient-text-hero">Catalog</span>
            </h1>
            <p style={{ color: "var(--text-body)", maxWidth: "600px", fontSize: "1rem", lineHeight: 1.6 }}>
              Explore high-definition course tracks with free preview videos, verified syllabi, and industry-grade certifications.
            </p>
          </div>

          {/* Quick Search with Premium Glow */}
          <div style={{ width: "100%", maxWidth: "380px" }}>
            <div
              className="input-with-icon"
              style={{
                background: "#ffffff",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
                borderRadius: "var(--radius-full)",
              }}
            >
              <Search className="input-icon-left" size={18} color="var(--primary)" />
              <input
                type="text"
                placeholder="Search course title or instructor..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="form-control"
                style={{ borderRadius: "var(--radius-full)", paddingLeft: "2.6rem" }}
              />
              {keyword && (
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setKeyword("")}
                  style={{ background: "none", border: "none" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Filter Pill Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "0.25rem" }}>
            Tracks:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            style={{
              padding: "0.33rem 0.85rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all var(--transition-fast)",
              border: !selectedCategory ? "1px solid var(--primary)" : "1px solid var(--border)",
              background: !selectedCategory ? "var(--primary)" : "#ffffff",
              color: !selectedCategory ? "#ffffff" : "var(--text-body)",
              boxShadow: !selectedCategory ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
            }}
          >
            All Disciplines
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.categoryName;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "" : cat.categoryName)}
                style={{
                  padding: "0.33rem 0.85rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                  background: isSelected ? "var(--primary)" : "#ffffff",
                  color: isSelected ? "#ffffff" : "var(--text-body)",
                  boxShadow: isSelected ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
                }}
              >
                {cat.categoryName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Course Cards */}
      <div
        className="catalog-layout"
        style={{
          display: "flex",
          gap: "1.6rem",
          alignItems: "flex-start",
        }}
      >
        {/* Desktop Sidebar Filters */}
        <aside
          className="catalog-sidebar"
          style={{
            width: "270px",
            flexShrink: 0,
            background: "var(--surface)",
            padding: "1.3rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-xs)",
            position: "sticky",
            top: "90px",
            alignSelf: "flex-start",
            height: "fit-content",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.8rem", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.05rem" }}>
              <Filter size={18} color="var(--primary)" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Category
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.5rem" }}>
              <button
                onClick={() => setSelectedCategory("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: !selectedCategory ? "var(--primary-light)" : "none",
                  color: !selectedCategory ? "var(--primary)" : "var(--text-main)",
                  border: "none",
                  padding: "0.45rem 0.65rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  fontWeight: !selectedCategory ? 700 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>All Categories</span>
                {!selectedCategory && <Check size={16} />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.categoryName)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: selectedCategory === cat.categoryName ? "var(--primary-light)" : "none",
                    color: selectedCategory === cat.categoryName ? "var(--primary)" : "var(--text-main)",
                    border: "none",
                    padding: "0.45rem 0.65rem",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9rem",
                    fontWeight: selectedCategory === cat.categoryName ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>{cat.categoryName}</span>
                  {selectedCategory === cat.categoryName && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Class Level Filter */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Class / Proficiency
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-control"
              style={{ marginTop: "0.5rem" }}
            >
              <option value="">All Levels</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls.className}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Access Type Filter */}
          <div style={{ marginBottom: "0.25rem" }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
              Access Type
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.5rem" }}>
              {[
                { id: "", label: "All Formats" },
                { id: "free", label: "Free Courses" },
                { id: "paid", label: "Premium Tracks" },
                { id: "trial", label: "Trial Video Available" },
              ].map((acc) => (
                <label
                  key={acc.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    color: "var(--text-main)",
                  }}
                >
                  <input
                    type="radio"
                    name="accessType"
                    checked={selectedAccess === acc.id}
                    onChange={() => setSelectedAccess(acc.id)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span>{acc.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Courses Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Top Sort & Count Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
              background: "var(--surface)",
              padding: "0.75rem 1.1rem",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Showing <strong style={{ color: "var(--text-main)" }}>{courses.length}</strong> available courses
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-control"
                style={{ width: "auto", padding: "0.35rem 0.85rem", fontSize: "0.85rem" }}
              >
                <option value="latest">Latest Released</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {selectedCategory && (
                <span className="badge badge-primary" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  Category: {selectedCategory}
                  <X size={13} style={{ cursor: "pointer" }} onClick={() => setSelectedCategory("")} />
                </span>
              )}
              {selectedClass && (
                <span className="badge badge-primary" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  Level: {selectedClass}
                  <X size={13} style={{ cursor: "pointer" }} onClick={() => setSelectedClass("")} />
                </span>
              )}
              {selectedAccess && (
                <span className="badge badge-sub" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  Access: {selectedAccess}
                  <X size={13} style={{ cursor: "pointer" }} onClick={() => setSelectedAccess("")} />
                </span>
              )}
              {keyword && (
                <span className="badge badge-gray" style={{ padding: "0.35rem 0.65rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  Keyword: "{keyword}"
                  <X size={13} style={{ cursor: "pointer" }} onClick={() => setKeyword("")} />
                </span>
              )}
            </div>
          )}

          {/* Course Cards Grid */}
          {loading ? (
            <div className="grid-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseSkeletonCard key={i} />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid-3">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No courses match your criteria"
              description="Try clearing some of your selected filters or search terms to see more available curriculum tracks."
              actionText="Clear All Filters"
              onAction={handleResetFilters}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseCatalogPage;